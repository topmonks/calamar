import { isHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";

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

import { warningAssert } from "../utils/assert";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { decodeAddress, encodeAddress, isAccountPublicKey, isEncodedAddress } from "../utils/address";

import { BlocksFilter, BlocksOrder, blocksFilterToExplorerSquidFilter, unifyExplorerSquidBlock } from "./blocksService";
import { EventsFilter, EventsOrder, addEventsArgs, eventsFilterToExplorerSquidFilter, normalizeEventName, unifyExplorerSquidEvent } from "./eventsService";
import { ExtrinsicsFilter, ExtrinsicsOrder, extrinsicFilterToExplorerSquidFilter, normalizeExtrinsicName, unifyExplorerSquidExtrinsic } from "./extrinsicsService";
import { fetchExplorerSquid } from "./fetchService";
import { getNetworks, hasSupport } from "./networksService";
import { emptyResponse } from "../utils/items-response";

export type ItemId = {
	id: string;
}

export type NetworkSearchResult = {
	network: Network;
	accounts: ItemsResponse<Account>;
	blocks: ItemsResponse<Block>;
	extrinsics: ItemsResponse<Extrinsic>;
	events: ItemsResponse<Event>;
	total: number;
}

export type SearchResult = {
	results: NetworkSearchResult[];
	accountsTotal: number;
	blocksTotal: number;
	extrinsicsTotal: number;
	eventsTotal: number;
	total: number;
};

export async function search(query: string, networks: Network[] = []): Promise<SearchResult> {
	if (networks.length === 0) {
		networks = getNetworks();
	}

	const promiseResults = await Promise.allSettled(networks.map(async network => await searchNetwork(network, query, networks.length === 1)));

	const results = promiseResults.filter(result => !!(result as any).value).map(result => (result as any).value as NetworkSearchResult);
	let nonEmptyResults = results.filter((result) => result.total > 0);

	if (isAccountPublicKey(query) && nonEmptyResults.length === 0) {
		// if hash doesn't belong to any extrinsic or block, consider it as account's public key
		nonEmptyResults = results.map<NetworkSearchResult>((result) => (
			{
				...result,
				accounts: {
					data: [{
						id: decodeAddress(query),
						address: encodeAddress(query, result.network.prefix),
						identity: null
					}],
					pagination: {
						offset: 0,
						limit: 0,
						hasNextPage: false,
					},
					totalCount: 1
				},
				total: 1
			}
		));
	}

	const accountsTotal = nonEmptyResults.reduce((total, result) => total + (result.accounts.totalCount || 0), 0);
	const blocksTotal = nonEmptyResults.reduce((total, result) => total + (result.blocks.totalCount || 0), 0);
	const extrinsicsTotal = nonEmptyResults.reduce((total, result) => total + (result.extrinsics.totalCount || 0), 0);
	const eventsTotal = nonEmptyResults.reduce((total, result) => total + (result.events.totalCount || 0), 0);
	const total = nonEmptyResults.reduce((total, result) => total + result.total, 0);

	const result: SearchResult = {
		results: nonEmptyResults,
		accountsTotal,
		blocksTotal,
		extrinsicsTotal,
		eventsTotal,
		total
	};

	warningAssert(!isHex(query) || blocksTotal <= 1, {
		message: "Block hashes should be unique",
		query,
		result
	});

	return result;
}

/*** PRIVATE ***/

async function searchNetwork(network: Network, query: string, fetchAll = false) {
	if (!hasSupport(network.name, "explorer-squid")) {
		return undefined;
	}

	if (isHex(query)) {
		return searchNetworkByHash(network, query);
	} else if (query?.match(/^\d+$/)) {
		return searchNetworkByBlockHeight(network, parseInt(query));
	} else if (isEncodedAddress(network, query)) {
		return searchNetworkByEncodedAddress(network, query);
	} else {
		return searchNetworkByName(network, query, fetchAll);
	}
}


async function searchNetworkByHash(network: Network, hash: string) {
	const blocksFilter: BlocksFilter = {hash_eq: hash};
	const extrinsicsFilter: ExtrinsicsFilter = {hash_eq: hash};

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic, true>,
	}>(
		network.name,
		`query (
			$limit: Int,
			$blocksFilter: BlockWhereInput,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			blocks: blocksConnection(first: $limit, where: $blocksFilter, orderBy: id_ASC) {
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
			extrinsics: extrinsicsConnection(first: $limit, where: $extrinsicsFilter, orderBy: id_ASC) {
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
			limit: 10,
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
		}
	);

	const blocks = await extractConnectionItems(response.blocks, {offset: 0, limit: 10}, unifyExplorerSquidBlock);
	const extrinsics = await extractConnectionItems(response.extrinsics, {offset: 0, limit: 10}, unifyExplorerSquidExtrinsic, network.name);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks,
		extrinsics,
		events: emptyResponse(),
		total: blocks.totalCount + extrinsics.totalCount
	};

	return result;
}

async function searchNetworkByBlockHeight(network: Network, height: number) {
	const blocksFilter: BlocksFilter = {height_eq: height};

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
	}>(
		network.name,
		`query (
			$limit: Int,
			$blocksFilter: BlockWhereInput,
		) {
			blocks: blocksConnection(first: $limit, where: $blocksFilter, orderBy: id_ASC) {
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
			limit: 10,
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
		}
	);

	const blocks = await extractConnectionItems(response.blocks, {offset: 0, limit: 10}, unifyExplorerSquidBlock);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks,
		extrinsics: emptyResponse(),
		events: emptyResponse(),
		total: blocks.totalCount
	};

	return result;
}

async function searchNetworkByEncodedAddress(network: Network, encodedAddress: string) {
	const result: NetworkSearchResult = {
		network,
		accounts: {
			data: [{
				id: decodeAddress(encodedAddress),
				address: encodedAddress,
				identity: null
			}],
			pagination: {
				limit: 10,
				offset: 0,
				hasNextPage: false
			},
			totalCount: 1
		},
		blocks: emptyResponse(),
		extrinsics: emptyResponse(),
		events: emptyResponse(),
		total: 1
	};

	return result;
}

async function searchNetworkByName(network: Network, query: string, fetchAll: boolean) {
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

	const response = await fetchExplorerSquid<{
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic>,
		events: ItemsConnection<ExplorerSquidEvent>,
	}>(
		network.name,
		`query (
			$limit: Int,
			$eventsFilter: EventWhereInput,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			extrinsics: extrinsicsConnection(first: $limit, where: $extrinsicsFilter, orderBy: id_DESC) {
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
			events: eventsConnection(first: $limit, where: $eventsFilter, orderBy: id_DESC) {
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
			limit: 10,
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
			eventsFilter: eventsFilterToExplorerSquidFilter(eventsFilter),
		}
	);

	const extrinsics = await extractConnectionItems(
		response.extrinsics,
		{offset: 0, limit: 10},
		unifyExplorerSquidExtrinsic,
		network.name
	);

	const events = await addEventsArgs(
		network.name,
		await extractConnectionItems(
			response.events,
			{offset: 0, limit: 10},
			unifyExplorerSquidEvent,
			network.name
		)
	);

	extrinsics.totalCount = countersResponse.extrinsicsByNameCounter?.total || 0;
	events.totalCount = countersResponse.eventsByNameCounter?.total || 0;

	const result: NetworkSearchResult = {
		network,
		accounts: emptyResponse(),
		blocks: emptyResponse(),
		extrinsics,
		events,
		total: extrinsics.totalCount + events.totalCount
	};

	return result;
}
