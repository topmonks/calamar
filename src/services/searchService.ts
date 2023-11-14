import { isHex } from "@polkadot/util";

import { ArchiveExtrinsic } from "../model/archive/archiveExtrinsic";
import { ArchiveBlock } from "../model/archive/archiveBlock";

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
import { PaginationOptions } from "../model/paginationOptions";
import { SearchResult } from "../model/searchResult";
import { SearchResultItem } from "../model/searchResultItem";

import { decodeAddress, encodeAddress, isAccountPublicKey, isEncodedAddress } from "../utils/address";
import { warningAssert } from "../utils/assert";
import { NetworkError, NonFatalError } from "../utils/error";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";
import { emptyItemsResponse } from "../utils/itemsResponse";
import { PickByType } from "../utils/types";

import { BlocksFilter, blocksFilterToArchiveFilter, blocksFilterToExplorerSquidFilter, unifyArchiveBlock, unifyExplorerSquidBlock } from "./blocksService";
import { addEventsArgs, eventsFilterToExplorerSquidFilter, normalizeEventName, unifyExplorerSquidEvent } from "./eventsService";
import { ExtrinsicsFilter, extrinsicFilterToArchiveFilter, extrinsicFilterToExplorerSquidFilter, normalizeExtrinsicName, unifyArchiveExtrinsic, unifyExplorerSquidExtrinsic } from "./extrinsicsService";
import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";

export type SearchPaginationOptions = Record<keyof PickByType<NetworkSearchResult, ItemsResponse<any, true>>, PaginationOptions>;

export async function search(query: string, networks: Network[], pagination: SearchPaginationOptions): Promise<SearchResult> {
	const promiseResults = await Promise.allSettled(
		networks.map(async (network) =>
			searchNetwork(network, query, pagination, networks.length === 1)
		)
	);

	const networkResults = promiseResults
		.map((it) => it.status === "fulfilled" ? it.value : undefined)
		.filter((it): it is NetworkSearchResult => !!it);

	const errors = promiseResults
		.map((it, index) => {
			if (it.status !== "rejected") {
				return undefined;
			}

			if (it.reason instanceof NonFatalError) {
				return new NetworkError(networks[index]!, it.reason);
			}

			throw it.reason;
		})
		.filter((it): it is NetworkError => !!it);

	console.log("results", networkResults);
	console.log("errors", errors);

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
						totalPageCount: 1,
						hasPrevious: false,
						hasNext: false,
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
			accounts: itemsToSearchResultItems(accounts),
			blocks: itemsToSearchResultItems(blocks),
			extrinsics: itemsToSearchResultItems(extrinsics),
			events: itemsToSearchResultItems(events),
			totalCount
		};
	}

	const accounts = networkResultsToSearchResultItems<Account>(nonEmptyNetworkResults, "accounts", pagination.accounts);
	const blocks = networkResultsToSearchResultItems<Block>(nonEmptyNetworkResults, "blocks", pagination.blocks);
	const extrinsics = networkResultsToSearchResultItems<Extrinsic>(nonEmptyNetworkResults, "extrinsics", pagination.extrinsics);
	const events = networkResultsToSearchResultItems<Event>(nonEmptyNetworkResults, "events", pagination.events);

	const totalCount = accounts.totalCount + blocks.totalCount + extrinsics.totalCount + events.totalCount;

	warningAssert(!isHex(query) || blocks.totalCount <= 1, {
		message: "Block hashes should be unique",
		query
	});

	return {
		accounts,
		blocks,
		extrinsics,
		events,
		errors,
		totalCount
	};
}

export function getQueryType(network: Network, query: string) {
	if (isHex(query)) {
		return "hash";
	} else if (query?.match(/^\d+$/)) {
		return "blockHeight";
	} else if (isEncodedAddress(network, query)) {
		return "encodedAddress";
	} else {
		return "name";
	}
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
	pagination: SearchPaginationOptions,
	fetchAll = false
) {
	switch (getQueryType(network, query)) {
		case "hash":
			if (hasSupport(network.name, "explorer-squid")) {
				return searchNetworkByHash(network, query, pagination);
			}

			return searchNetworkArchiveByHash(network, query, pagination);
		case "blockHeight":
			if (hasSupport(network.name, "explorer-squid")) {
				return searchNetworkByBlockHeight(network, parseInt(query), pagination);
			}

			return searchNetworkArchiveByBlockHeight(network, parseInt(query), pagination);
		case "encodedAddress":
			return searchNetworkByEncodedAddress(network, query, pagination);
		default:
			if (hasSupport(network.name, "explorer-squid")) {
				return searchNetworkByName(network, query, pagination, fetchAll);
			}

			return undefined;
	}
}


async function searchNetworkByHash(
	network: Network,
	hash: string,
	pagination: SearchPaginationOptions,
) {
	const blocksFilter: BlocksFilter = {hash};
	const extrinsicsFilter: ExtrinsicsFilter = {hash};

	const blocksCursor = paginationToConnectionCursor(pagination.blocks);
	const extrinsicsCursor = paginationToConnectionCursor(pagination.extrinsics);

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic, true>,
	}>(
		network.name,
		`query (
			$blocksFirst: Int!,
			$blocksAfter: String,
			$blocksFilter: BlockWhereInput,
			$extrinsicsFirst: Int!,
			$extrinsicsAfter: String,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			blocks: blocksConnection(first: $blocksFirst, after: $blocksAfter, where: $blocksFilter, orderBy: id_ASC) {
				...ExplorerSquidBlocksConnection
				totalCount
			},
			extrinsics: extrinsicsConnection(first: $extrinsicsFirst, after: $extrinsicsAfter, where: $extrinsicsFilter, orderBy: id_ASC) {
				...ExplorerSquidExtrinsicsConnection
				totalCount
			}
		}`,
		{
			blocksFirst: blocksCursor.first,
			blocksAfter: blocksCursor.after,
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
			extrinsicsFirst: extrinsicsCursor.first,
			extrinsicsAfter: extrinsicsCursor.after,
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
		}
	);

	const blocks = await extractConnectionItems(
		response.blocks,
		pagination.blocks,
		unifyExplorerSquidBlock,
		network.name
	);

	const extrinsics = await extractConnectionItems(
		response.extrinsics,
		pagination.extrinsics,
		unifyExplorerSquidExtrinsic,
		network.name
	);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyItemsResponse(0),
		blocks,
		extrinsics,
		events: emptyItemsResponse(0),
		totalCount: blocks.totalCount + extrinsics.totalCount
	};

	return result;
}

async function searchNetworkArchiveByHash(
	network: Network,
	hash: string,
	pagination: SearchPaginationOptions,
) {
	const blocksFilter: BlocksFilter = {hash};
	const extrinsicsFilter: ExtrinsicsFilter = {hash};

	const blocksCursor = paginationToConnectionCursor(pagination.blocks);
	const extrinsicsCursor = paginationToConnectionCursor(pagination.extrinsics);

	const response = await fetchArchive<{
		blocks: ItemsConnection<ArchiveBlock, true>,
		extrinsics: ItemsConnection<ArchiveExtrinsic, true>,
	}>(
		network.name,
		`query (
			$blocksFirst: Int!,
			$blocksAfter: String,
			$blocksFilter: BlockWhereInput,
			$extrinsicsFirst: Int!,
			$extrinsicsAfter: String,
			$extrinsicsFilter: ExtrinsicWhereInput,
		) {
			blocks: blocksConnection(first: $blocksFirst, after: $blocksAfter, where: $blocksFilter, orderBy: id_ASC) {
				...ArchiveBlocksConnection
				totalCount
			},
			extrinsics: extrinsicsConnection(first: $extrinsicsFirst, after: $extrinsicsAfter, where: $extrinsicsFilter, orderBy: id_ASC) {
				...ArchiveExtrinsicsConnection
				totalCount
			}
		}`,
		{
			blocksFirst: blocksCursor.first,
			blocksAfter: blocksCursor.after,
			blocksFilter: blocksFilterToArchiveFilter(blocksFilter),
			extrinsicsFirst: extrinsicsCursor.first,
			extrinsicsAfter: extrinsicsCursor.after,
			extrinsicsFilter: extrinsicFilterToArchiveFilter(extrinsicsFilter),
		}
	);

	const blocks = await extractConnectionItems(
		response.blocks,
		pagination.blocks,
		unifyArchiveBlock,
		network.name
	);

	const extrinsics = await extractConnectionItems(
		response.extrinsics,
		pagination.extrinsics,
		unifyArchiveExtrinsic,
		network.name
	);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyItemsResponse(0),
		blocks,
		extrinsics,
		events: emptyItemsResponse(0),
		totalCount: blocks.totalCount + extrinsics.totalCount
	};

	return result;
}

async function searchNetworkByBlockHeight(network: Network, height: number, pagination: SearchPaginationOptions) {
	const blocksFilter: BlocksFilter = {height};

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock, true>,
	}>(
		network.name,
		`query ($blocksFilter: BlockWhereInput) {
			blocks: blocksConnection(first: 1, where: $blocksFilter, orderBy: id_ASC) {
				...ExplorerSquidBlocksConnection
				totalCount
			},
		}`,
		{
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
		}
	);

	const blocks = await extractConnectionItems(
		response.blocks,
		pagination.blocks,
		unifyExplorerSquidBlock,
		network.name
	);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyItemsResponse(0),
		blocks,
		extrinsics: emptyItemsResponse(0),
		events: emptyItemsResponse(0),
		totalCount: blocks.totalCount
	};

	return result;
}

async function searchNetworkArchiveByBlockHeight(network: Network, height: number, pagination: SearchPaginationOptions) {
	const blocksFilter: BlocksFilter = {height};

	const response = await fetchArchive<{
		blocks: ItemsConnection<ArchiveBlock, true>,
	}>(
		network.name,
		`query ($blocksFilter: BlockWhereInput) {
			blocks: blocksConnection(first: 1, where: $blocksFilter, orderBy: id_ASC) {
				...ArchiveBlocksConnection
				totalCount
			},
		}`,
		{
			blocksFilter: blocksFilterToArchiveFilter(blocksFilter),
		}
	);

	const blocks = await extractConnectionItems(
		response.blocks,
		pagination.blocks,
		unifyArchiveBlock,
		network.name
	);

	const result: NetworkSearchResult = {
		network,
		accounts: emptyItemsResponse(0),
		blocks,
		extrinsics: emptyItemsResponse(0),
		events: emptyItemsResponse(0),
		totalCount: blocks.totalCount
	};

	return result;
}

async function searchNetworkByEncodedAddress(network: Network, encodedAddress: string, pagination: SearchPaginationOptions) {
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
				page: pagination.accounts.page,
				pageSize: pagination.accounts.pageSize,
				totalPageCount: 1,
				hasPrevious: false,
				hasNext: false,
			},
			totalCount: 1
		},
		blocks: emptyItemsResponse(0),
		extrinsics: emptyItemsResponse(0),
		events: emptyItemsResponse(0),
		totalCount: 1
	};

	return result;
}

async function searchNetworkByName(
	network: Network,
	query: string,
	pagination: SearchPaginationOptions,
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

	let extrinsics: ItemsResponse<Extrinsic, true> = emptyItemsResponse(countersResponse.extrinsicsByNameCounter?.total || 0);
	let events: ItemsResponse<Event, true> = emptyItemsResponse(countersResponse.eventsByNameCounter?.total || 0);

	if (fetchAll) {
		const extrinsicsFilter = extrinsicName.call
			? { palletName: extrinsicName.pallet, callName: extrinsicName.call }
			: { palletName: extrinsicName.pallet };
		const eventsFilter = eventName.event
			? { palletName: eventName.pallet, eventName: eventName.event }
			: { palletName: eventName.pallet };

		const extrinsicsCursor = paginationToConnectionCursor(pagination.extrinsics);
		const eventsCursor = paginationToConnectionCursor(pagination.events);

		const response = await fetchExplorerSquid<{
			extrinsics: ItemsConnection<ExplorerSquidExtrinsic>,
			events: ItemsConnection<ExplorerSquidEvent>,
		}>(
			network.name,
			`query (
				$extrinsicsFirst: Int!,
				$extrinsicsAfter: String,
				$extrinsicsFilter: ExtrinsicWhereInput,
				$eventsFirst: Int!,
				$eventsAfter: String,
				$eventsFilter: EventWhereInput,
			) {
				extrinsics: extrinsicsConnection(first: $extrinsicsFirst, after: $extrinsicsAfter, where: $extrinsicsFilter, orderBy: id_DESC) {
					...ExplorerSquidExtrinsicsConnection
				}
				events: eventsConnection(first: $eventsFirst, after: $eventsAfter, where: $eventsFilter, orderBy: id_DESC) {
					...ExplorerSquidEventsConnection
				}
			}`,
			{
				extrinsicsFirst: extrinsicsCursor.first,
				extrinsicsAfter: extrinsicsCursor.after,
				extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
				eventsFirst: eventsCursor.first,
				eventsAfter: eventsCursor.after,
				eventsFilter: eventsFilterToExplorerSquidFilter(eventsFilter),
			}
		);

		response.extrinsics.totalCount = countersResponse.extrinsicsByNameCounter?.total || 0;
		response.events.totalCount = countersResponse.eventsByNameCounter?.total || 0;

		extrinsics = await extractConnectionItems(
			response.extrinsics as ItemsConnection<ExplorerSquidExtrinsic, true>,
			pagination.extrinsics,
			unifyExplorerSquidExtrinsic,
			network.name
		);

		events = await addEventsArgs(
			network.name,
			await extractConnectionItems(
				response.events as ItemsConnection<ExplorerSquidEvent, true>,
				pagination.events,
				unifyExplorerSquidEvent,
				network.name
			)
		);
	}

	const result: NetworkSearchResult = {
		network,
		accounts: emptyItemsResponse(0),
		blocks: emptyItemsResponse(0),
		extrinsics,
		events,
		totalCount: extrinsics.totalCount + events.totalCount
	};

	return result;
}

function itemsToSearchResultItems<T extends {id: string, network: Network}>(items: ItemsResponse<T, true>): ItemsResponse<SearchResultItem<T>, true> {
	return {
		...items,
		data: items.data.map(it => ({
			id: `${it.network}-${it.id}`,
			network: it.network,
			data: it
		})),
	};
}

function networkResultsToSearchResultItems<T extends {id: string, network: Network}>(
	networkResults: NetworkSearchResult[],
	itemsType: keyof PickByType<NetworkSearchResult, ItemsResponse<T, true>>,
	pagination: PaginationOptions
): ItemsResponse<SearchResultItem<T>, true> {
	const data: SearchResultItem<T>[] = [];
	let totalCount = 0;

	for (const result of networkResults) {
		const items = result[itemsType];

		if (items.totalCount === 1) {
			const item = items.data[0] as unknown as T;

			data.push({
				id: `${result.network.name}-${item.id}`,
				network: result.network,
				data: item,
			});
		} else if (totalCount > 1) {
			data.push({
				id: `${result.network.name}-grouped`,
				network: result.network,
				groupedCount: items.totalCount > 1 ? items.totalCount : undefined
			});
		}

		totalCount += items.totalCount;
	}

	return {
		data: data.slice((pagination.page - 1) * pagination.pageSize, pagination.page * pagination.pageSize),
		pageInfo: {
			page: pagination.page,
			pageSize: pagination.pageSize,
			totalPageCount: Math.ceil(data.length / pagination.pageSize),
			hasPrevious: pagination.page > 0,
			hasNext: pagination.page * pagination.pageSize < data.length,
		},
		totalCount
	};
}
