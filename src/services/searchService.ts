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
import { decodeAddress, encodeAddress } from "../utils/formatAddress";

import { BlocksFilter, blocksFilterToExplorerSquidFilter, unifyExplorerSquidBlock } from "./blocksService";
import { EventsFilter, addEventsArgs, eventsFilterToExplorerSquidFilter, normalizeEventName, unifyExplorerSquidEvent } from "./eventsService";
import { ExtrinsicsFilter, extrinsicFilterToExplorerSquidFilter, normalizeExtrinsicName, unifyExplorerSquidExtrinsic } from "./extrinsicsService";
import { fetchExplorerSquid } from "./fetchService";
import { getNetworks, hasSupport } from "./networksService";

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

	const maybeHash = isHex(query);
	const maybeAddress = isAddress(query);

	const promiseResults = await Promise.allSettled(networks.map(async network => await searchNetwork(network, query, networks.length === 1)));

	const results = promiseResults.filter(result => !!(result as any).value).map(result => (result as any).value as NetworkSearchResult);
	let nonEmptyResults = results.filter((result) => result.total > 0);

	if (maybeHash && maybeAddress && nonEmptyResults.length === 0) {
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

	warningAssert(!maybeHash || blocksTotal + extrinsicsTotal <= 1, {
		message: "Blocks' and extrinsics' hashes should be unique",
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

	let extrinsicsFilter: ExtrinsicsFilter = {id_eq: ""}; // default failing filter
	let eventsFilter: EventsFilter = {id_eq: ""}; // default failing filter
	let blocksFilter: BlocksFilter = {id_eq: ""}; // default failing filter
	let extrinsicsByNameCounterId = ""; // default failing filter
	let eventsByNameCounterId = ""; // default failing filter

	const maybeHash = isHex(query);
	const maybeHeight = query?.match(/^\d+$/);
	const maybeAddress = isAddress(query);
	const maybeName = query && !maybeHash && !maybeHeight; //&& !maybeAddress;

	if (maybeHash) {
		extrinsicsFilter = {hash_eq: query};
		blocksFilter = {hash_eq: query};
	} else if (maybeHeight) {
		blocksFilter = {height_eq: parseInt(query)};
	} else if (maybeName) {
		const extrinsicName = await normalizeExtrinsicName(network.name, query);
		const eventName = await normalizeEventName(network.name, query);

		extrinsicsByNameCounterId = extrinsicName.call
			? `Extrinsics.${extrinsicName.pallet}.${extrinsicName.call}`
			: `Extrinsics.${extrinsicName.pallet}`;

		eventsByNameCounterId = eventName.event
			? `Events.${eventName.pallet}.${eventName.event}`
			: `Events.${eventName.pallet}`;

		if (fetchAll) {
			extrinsicsFilter = extrinsicName.call
				? { palletName_eq: extrinsicName.pallet, callName_eq: extrinsicName.call }
				: { palletName_eq: extrinsicName.pallet };

			eventsFilter = eventName.event
				? { palletName_eq: eventName.pallet, eventName_eq: eventName.event }
				: { palletName_eq: eventName.pallet };
		}
	}

	const response = await fetchExplorerSquid<{
		blocks: ItemsConnection<ExplorerSquidBlock>,
		extrinsics: ItemsConnection<ExplorerSquidExtrinsic>,
		events: ItemsConnection<ExplorerSquidEvent>,
		extrinsicsByNameCounter: {total: number} | null,
		eventsByNameCounter: {total: number} | null
	}>(
		network.name,
		`query (
			$limit: Int,
			$blocksFilter: BlockWhereInput,
			$eventsFilter: EventWhereInput,
			$extrinsicsFilter: ExtrinsicWhereInput,
			$extrinsicsByNameCounterId: String!,
			$eventsByNameCounterId: String!
		) {
			blocks: blocksConnection(first: $limit, where: $blocksFilter, orderBy: id_DESC) {
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
			},
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
			extrinsicsByNameCounter: itemsCounterById(id: $extrinsicsByNameCounterId) {
				total
			}
			eventsByNameCounter: itemsCounterById(id: $eventsByNameCounterId) {
				total
			}
		}`,
		{
			limit: fetchAll ? 10 : 1,
			blocksFilter: blocksFilterToExplorerSquidFilter(blocksFilter),
			extrinsicsFilter: extrinsicFilterToExplorerSquidFilter(extrinsicsFilter),
			eventsFilter: eventsFilterToExplorerSquidFilter(eventsFilter),
			extrinsicsByNameCounterId,
			eventsByNameCounterId,
		}
	);

	const result: NetworkSearchResult = {
		network,
		accounts: {
			data: [],
			pagination: {
				offset: 0,
				limit: 0,
				hasNextPage: false,
			},
			totalCount: 0,
		},
		blocks: await extractConnectionItems(response.blocks, {offset: 0, limit: fetchAll ? 10 : 1}, unifyExplorerSquidBlock),
		extrinsics: await extractConnectionItems(response.extrinsics, {offset: 0, limit: fetchAll ? 10 : 1}, unifyExplorerSquidExtrinsic, network.name),
		events: await addEventsArgs(network.name, await extractConnectionItems(response.events, {offset: 0, limit: fetchAll ? 10 : 1}, unifyExplorerSquidEvent, network.name)),
		total: 0
	};

	if (maybeHash || maybeHeight) {
		result.blocks.totalCount = result.blocks.data.length;
		result.extrinsics.totalCount = result.extrinsics.data.length;
		result.events.totalCount = 0;
	} else if (maybeName) {
		result.blocks.totalCount = result.blocks.data.length;
		result.extrinsics.totalCount = response.extrinsicsByNameCounter?.total || 0;
		result.events.totalCount = response.eventsByNameCounter?.total || 0;
	}

	if (maybeAddress) {
		const encodedAddress = encodeAddress(query, network.prefix);

		console.log("encoded address", network.name, encodedAddress);

		if (query === encodedAddress) {
			result.accounts.data = [{
				id: decodeAddress(query),
				address: encodedAddress,
				identity: null
			}];

			result.accounts.totalCount = 1;
		}
	}

	result.total =
		(result.accounts.totalCount || 0)
		+ (result.blocks.totalCount || 0)
		+ (result.extrinsics.totalCount || 0)
		+ (result.events.totalCount || 0);

	return result;
}
