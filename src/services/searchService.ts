import { isHex } from "@polkadot/util";

import { ExplorerSquidBlock } from "../model/explorer-squid/explorerSquidBlock";
import { ExplorerSquidEvent } from "../model/explorer-squid/explorerSquidEvent";
import { ExplorerSquidExtrinsic } from "../model/explorer-squid/explorerSquidExtrinsic";

import { Account } from "../model/account";
import { Block } from "../model/block";
import { Event } from "../model/event";
import { Extrinsic } from "../model/extrinsic";
import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { Network } from "../model/network";

import { decodeAddress, encodeAddress, isAccountPublicKey, isEncodedAddress } from "../utils/address";
import { warningAssert } from "../utils/assert";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";
import { emptyResponse } from "../utils/itemsResponse";

import { BlocksFilter, blocksFilterToExplorerSquidFilter, unifyExplorerSquidBlock } from "./blocksService";
import { EventsFilter, addEventsArgs, eventsFilterToExplorerSquidFilter, normalizeEventName, unifyExplorerSquidEvent } from "./eventsService";
import { ExtrinsicsFilter, extrinsicFilterToExplorerSquidFilter, normalizeExtrinsicName, unifyExplorerSquidExtrinsic } from "./extrinsicsService";
import { fetchExplorerSquid } from "./fetchService";
import { getNetwork, getNetworks, hasSupport } from "./networksService";
import { PaginationOptions } from "../model/paginationOptions";
import { PickByType } from "../utils/types";
import { SearchResult } from "../model/searchResult";
import { SearchResultItem } from "../model/searchResultItem";

export async function search(query: string, networks: Network[], pagination: PaginationOptions): Promise<SearchResult> {
	if (networks.length === 0) {
		networks = getNetworks();
	}

	const promiseResults = await Promise.allSettled(
		networks.map(async (network) =>
			searchNetwork(network, query, pagination, networks.length === 1)
		)
	);

	const networkResults = promiseResults
		.map((it) => it.status === "fulfilled" ? it.value : undefined)
		.filter((it): it is NetworkSearchResult => !!it);

	let nonEmptyNetworkResults = networkResults.filter((result) => result.totalCount > 0);

	if (isAccountPublicKey(query) && nonEmptyNetworkResults.length === 0) {
		// if hash doesn't belong to any extrinsic or block, consider it as account's public key
		nonEmptyNetworkResults = networkResults.map<NetworkSearchResult>((result) => (
			{
				...result,
				accounts: {
					data: [{
						id: decodeAddress(query),
						network: result.network,
						address: encodeAddress(query, result.network.prefix),
						identity: null
					}],
					pageInfo: {
						page: 1,
						pageSize: 10, // TODO constant
						hasNextPage: false,
					},
					totalCount: 1
				},
				totalCount: 1
			}
		));
	}

	console.log("non empty results", nonEmptyNetworkResults);

	if (networks.length === 1 && nonEmptyNetworkResults[0]) {
		// when searching in single network, use found items
		// directly as search items without grouping

		const {
			accounts,
			blocks,
			extrinsics,
			events,
			totalCount
		} = nonEmptyNetworkResults[0];

		return {
			accountItems: itemsToSearchResultItems(accounts),
			blockItems: itemsToSearchResultItems(blocks),
			extrinsicItems: itemsToSearchResultItems(extrinsics),
			eventItems: itemsToSearchResultItems(events),
			accountsTotalCount: accounts.totalCount,
			blocksTotalCount: blocks.totalCount,
			extrinsicsTotalCount: extrinsics.totalCount,
			eventsTotalCount: events.totalCount,
			totalCount
		};
	}

	const accountItems = networkResultsToSearchResultItems<Account>(nonEmptyNetworkResults, "accounts", pagination);
	const blockItems = networkResultsToSearchResultItems<Block>(nonEmptyNetworkResults, "blocks", pagination);
	const extrinsicItems = networkResultsToSearchResultItems<Extrinsic>(nonEmptyNetworkResults, "extrinsics", pagination);
	const eventItems = networkResultsToSearchResultItems<Event>(nonEmptyNetworkResults, "events", pagination);

	const accountsTotalCount = nonEmptyNetworkResults.reduce((total, result) => total + result.accounts.totalCount, 0);
	const blocksTotalCount = nonEmptyNetworkResults.reduce((total, result) => total + result.blocks.totalCount, 0);
	const extrinsicsTotalCount = nonEmptyNetworkResults.reduce((total, result) => total + result.extrinsics.totalCount, 0);
	const eventsTotalCount = nonEmptyNetworkResults.reduce((total, result) => total + result.events.totalCount, 0);
	const totalCount = nonEmptyNetworkResults.reduce((total, result) => total + result.totalCount, 0);

	warningAssert(!isHex(query) || blocksTotalCount <= 1, {
		message: "Block hashes should be unique",
		query
	});

	return {
		accountItems,
		blockItems,
		extrinsicItems,
		eventItems,
		accountsTotalCount,
		blocksTotalCount,
		extrinsicsTotalCount,
		eventsTotalCount,
		totalCount
	};
}

/*** PRIVATE ***/

type NetworkSearchResult = {
	network: Network;
	accounts: ItemsResponse<Account, true>;
	blocks: ItemsResponse<Block, true>;
	extrinsics: ItemsResponse<Extrinsic, true>;
	events: ItemsResponse<Event, true>;
	totalCount: number;
}

async function searchNetwork(
	network: Network,
	query: string,
	pagination: PaginationOptions,
	fetchAll = false
) {
	if (!hasSupport(network.name, "explorer-squid")) {
		return undefined; // TODO support all networks
	}

	if (isHex(query)) {
		return searchNetworkByHash(network, query, pagination);
	} else if (query?.match(/^\d+$/)) {
		return searchNetworkByBlockHeight(network, parseInt(query));
	} else if (isEncodedAddress(network, query)) {
		return searchNetworkByEncodedAddress(network, query);
	} else {
		return searchNetworkByName(network, query, pagination, fetchAll);
	}
}


async function searchNetworkByHash(
	network: Network,
	hash: string,
	pagination: PaginationOptions,
) {
	const blocksFilter: BlocksFilter = {hash_eq: hash};
	const extrinsicsFilter: ExtrinsicsFilter = {hash_eq: hash};

	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic, true>,
	}>(
		network.name,
		`query (
			$first: Int!,
			$after: String
			$blocksFilter: BlockWhereInput,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			blocks: blocksConnection(first: $first, after: $after, where: $blocksFilter, orderBy: id_ASC) {
				edges {
					node {
						id
						hash
						height
						timestamp
						parentHash
						validator
						specVersion
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				totalCount
			},
			extrinsics: extrinsicsConnection(first: $first, after: $after, where: $extrinsicsFilter, orderBy: id_ASC) {
				edges {
					node {
						id
						extrinsicHash
						block {
							id
							hash
							height
							timestamp
							specVersion
						}
						mainCall {
							callName
							palletName
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
						error
						version
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				totalCount
			}
		}`,
		{
			first,
			after,
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
		}
	);

	const blocks = await extractConnectionItems(response.blocks, unifyExplorerSquidBlock, network.name);
	const extrinsics = await extractConnectionItems(response.extrinsics, unifyExplorerSquidExtrinsic, network.name);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks,
		extrinsics,
		events: emptyResponse(),
		totalCount: blocks.totalCount + extrinsics.totalCount
	};

	return result;
}

async function searchNetworkByBlockHeight(network: Network, height: number) {
	const blocksFilter: BlocksFilter = {height_eq: height};

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
	}>(
		network.name,
		`query ($blocksFilter: BlockWhereInput) {
			blocks: blocksConnection(first: 1, where: $blocksFilter, orderBy: id_ASC) {
				edges {
					node {
						id
						hash
						height
						timestamp
						parentHash
						validator
						specVersion
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				totalCount
			},
		}`,
		{
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
		}
	);

	const blocks = await extractConnectionItems(response.blocks, unifyExplorerSquidBlock, network.name);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks,
		extrinsics: emptyResponse(),
		events: emptyResponse(),
		totalCount: blocks.totalCount
	};

	return result;
}

async function searchNetworkByEncodedAddress(network: Network, encodedAddress: string) {
	const result: NetworkSearchResult = {
		network,
		accounts: {
			data: [{
				id: decodeAddress(encodedAddress),
				network: getNetwork(network.name),
				address: encodedAddress,
				identity: null
			}],
			pageInfo: {
				page: 1,
				pageSize: 10,
				hasNextPage: false
			},
			totalCount: 1
		},
		blocks: emptyResponse(),
		extrinsics: emptyResponse(),
		events: emptyResponse(),
		totalCount: 1
	};

	return result;
}

async function searchNetworkByName(
	network: Network,
	query: string,
	pagination: PaginationOptions,
	fetchAll: boolean,
) {
	const extrinsicName = await normalizeExtrinsicName(network.name, query);
	const eventName = await normalizeEventName(network.name, query);

	const extrinsicsByNameCounterId = extrinsicName.call
		? `Extrinsics.${extrinsicName.pallet}.${extrinsicName.call}`
		: `Extrinsics.${extrinsicName.pallet}`;

	const eventsByNameCounterId = eventName.event
		? `Events.${eventName.pallet}.${eventName.event}`
		: `Events.${eventName.pallet}`;

	const countersResponse = await fetchExplorerSquid<{
		extrinsicsByNameCounter: {total: number} | null,
		eventsByNameCounter: {total: number} | null
	}>(
		network.name,
		`query (
			$extrinsicsByNameCounterId: String!,
			$eventsByNameCounterId: String!
		) {
			extrinsicsByNameCounter: itemsCounterById(id: $extrinsicsByNameCounterId) {
				total
			}
			eventsByNameCounter: itemsCounterById(id: $eventsByNameCounterId) {
				total
			}
		}`,
		{
			extrinsicsByNameCounterId,
			eventsByNameCounterId,
		}
	);

	let extrinsicsFilter: ExtrinsicsFilter = {id_eq: ""}; // default failing filter
	let eventsFilter: EventsFilter = {id_eq: ""}; // default failing filter

	if (fetchAll) {
		if (countersResponse.extrinsicsByNameCounter?.total) {
			extrinsicsFilter = extrinsicName.call
				? { palletName_eq: extrinsicName.pallet, callName_eq: extrinsicName.call }
				: { palletName_eq: extrinsicName.pallet };
		}

		if (countersResponse.eventsByNameCounter?.total) {
			eventsFilter = eventName.event
				? { palletName_eq: eventName.pallet, eventName_eq: eventName.event }
				: { palletName_eq: eventName.pallet };
		}
	}

	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchExplorerSquid<{
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic>,
		events: ItemsConnection<ExplorerSquidEvent>,
	}>(
		network.name,
		`query (
			$first: Int!,
			$after: String
			$eventsFilter: EventWhereInput,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			extrinsics: extrinsicsConnection(first: $first, after: $after, where: $extrinsicsFilter, orderBy: id_DESC) {
				edges {
					node {
						id
						extrinsicHash
						block {
							id
							hash
							height
							timestamp
							specVersion
						}
						mainCall {
							callName
							palletName
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
						error
						version
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
			}
			events: eventsConnection(first: $first, after: $after, where: $eventsFilter, orderBy: id_DESC) {
				edges {
					node {
						id
						eventName
						palletName
						block {
							id
							height
							timestamp
							specVersion
						}
						extrinsic {
							id
						}
						call {
							id
						}
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
			}
		}`,
		{
			first,
			after,
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
			eventsFilter: eventsFilterToExplorerSquidFilter(eventsFilter),
		}
	);

	const extrinsics = await extractConnectionItems(
		response.extrinsics,
		unifyExplorerSquidExtrinsic,
		network.name
	);

	const events = await addEventsArgs(
		network.name,
		await extractConnectionItems(
			response.events,
			unifyExplorerSquidEvent,
			network.name
		)
	);

	const extrinsicsTotalCount = countersResponse.extrinsicsByNameCounter?.total || 0;
	const eventsTotalCount = countersResponse.eventsByNameCounter?.total || 0;

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks: emptyResponse(),
		extrinsics: {
			...extrinsics,
			totalCount: extrinsicsTotalCount
		},
		events: {
			...events,
			totalCount: eventsTotalCount
		},
		totalCount: extrinsicsTotalCount + eventsTotalCount
	};

	return result;
}

function itemsToSearchResultItems<T extends {network: Network}>(items: ItemsResponse<T, true>): ItemsResponse<SearchResultItem<T>, true> {
	return {
		...items,
		data: items.data.map(it => ({
			network: it.network,
			data: it
		})),
	};
}

function networkResultsToSearchResultItems<T>(
	networkResults: NetworkSearchResult[],
	itemsType: keyof PickByType<NetworkSearchResult, ItemsResponse<T, true>>,
	pagination: PaginationOptions
): ItemsResponse<SearchResultItem<T>, true> {
	const data = networkResults.flatMap<SearchResultItem<T>>((result) => {
		const {data, totalCount} = result[itemsType];

		if (totalCount === 0) {
			return [];
		}

		return [{
			network: result.network,
			data: totalCount === 1 ? data[0] as T : undefined,
			groupedCount: totalCount > 1 ? totalCount : undefined
		}];
	});

	return {
		data: data.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize),
		pageInfo: {
			page: pagination.page,
			pageSize: pagination.pageSize,
			hasNextPage: pagination.page * pagination.pageSize < data.length
		},
		totalCount: data.length
	};
}
