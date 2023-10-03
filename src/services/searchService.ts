import { isHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";

import { ArchiveBlock } from "../model/archive/archiveBlock";
import { ArchiveExtrinsic } from "../model/archive/archiveExtrinsic";
import { decodeAddress, encodeAddress } from "../utils/formatAddress";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { normalizeExtrinsicName } from "./extrinsicsService";
import { normalizeEventName } from "./eventsService";
import { getNetworks, hasSupport } from "./networksService";
import { Network } from "../model/network";
import { getLatestRuntimeSpecVersion } from "./runtimeSpecService";
import { getCallsRuntimeMetadata, getPalletsRuntimeMetadata } from "./runtimeMetadataService";
import { lowerFirst, upperFirst } from "../utils/string";

export type ItemId = {
	id: string;
}

export type NetworkSearchResult = {
	extrinsics: ItemId[];
	blocks: ItemId[];
	accounts: ItemId[];
	extrinsicsByNameTotal: number;
	eventsByNameTotal: number;
}

export type SearchResult = {
	results: [Network, NetworkSearchResult][];
	accountsTotal: number;
	blocksTotal: number;
	extrinsicsTotal: number;
	eventsTotal: number;
	total: number;
}

export async function search(query: string, networks?: Network[]): Promise<SearchResult> {
	/*return {
		results: [],
		accountsTotal: 0,
		blocksTotal: 0,
		extrinsicsTotal: 0,
		eventsTotal: 0,
		total: 0
	};*/

	if (!networks) {
		networks = getNetworks();
	}

	const maybeHash = isHex(query);
	const maybeAddress = isAddress(query);

	console.log(networks);

	console.log("make promises");

	const promiseResults = await Promise.allSettled(networks.map(async network => [network, await searchNetwork(network, query)]));

	console.log("settled", promiseResults);
	const results = promiseResults.filter(result => !!(result as any).value?.[1]).map(result => (result as any).value as [Network, NetworkSearchResult]);
	let nonEmptyResults = results.filter(([network, result]) =>
		result.extrinsics.length > 0
		|| result.blocks.length > 0
		|| result.accounts.length > 0
		|| result.extrinsicsByNameTotal > 0
		|| result.eventsByNameTotal > 0
	);

	if (maybeAddress && nonEmptyResults.length === 0) {
		nonEmptyResults = results.map(([network, result]) => ([
			network,
			{
				...result,
				accounts: [{
					id: decodeAddress(query)
				}]
			}
		]));
	}

	const accountsTotal = nonEmptyResults.reduce((total, [network, result]) => total + result.accounts.length, 0);
	const blocksTotal = nonEmptyResults.reduce((total, [network, result]) => total + result.blocks.length, 0);
	const extrinsicsTotal = nonEmptyResults.reduce((total, [network, result]) => total + result.extrinsics.length + result.extrinsicsByNameTotal, 0);
	const eventsTotal = nonEmptyResults.reduce((total, [network, result]) => total + result.extrinsicsByNameTotal, 0);

	return {
		results: nonEmptyResults,
		accountsTotal,
		blocksTotal,
		extrinsicsTotal,
		eventsTotal,
		total: accountsTotal + blocksTotal + extrinsicsTotal + eventsTotal
	};
}

/*** PRIVATE ***/

async function searchNetwork(network: Network, query: string) {
	if (!hasSupport(network.name, "explorer-squid")) {
		return undefined;
	}

	let extrinsicFilter: any = {extrinsicHash_eq: "0x"}; // default failing filter
	let blockFilter: any = {hash_eq: "0x"}; // default failing filter
	let extrinsicsByNameCounterId: any = ""; // default failing filter
	let eventsByNameCounterId: any = ""; // default failing filter

	const maybeHash = isHex(query);
	const maybeHeight = query?.match(/^\d+$/);
	const maybeAddress = isAddress(query);
	const maybeName = query && !maybeHash && !maybeHeight; //&& !maybeAddress;

	if (maybeHash) {
		extrinsicFilter = {extrinsicHash_eq: query};
		blockFilter = {hash_eq: query};
	}

	if (maybeHeight) {
		blockFilter = {height_eq: parseInt(query)};
	}

	if (maybeName) {
		const {palletName, callName} = await normalizeExtrinsicName(network.name, query);

		extrinsicsByNameCounterId = callName
			? `Extrinsics.${palletName}.${callName}`
			: `Extrinsics.${palletName}`;
	}

	if (maybeName) {
		const {palletName, eventName} = await normalizeEventName(network.name, query);

		eventsByNameCounterId = eventName
			? `Events.${palletName}.${eventName}`
			: `Events.${palletName}`;
	}

	const response = await fetchExplorerSquid<{
		extrinsics: ItemId[],
		blocks: ItemId[],
		extrinsicsByNameCounter: {total: number} | null,
		eventsByNameCounter: {total: number} | null
	}>(
		network.name,
		`query (
			$extrinsicFilter: ExtrinsicWhereInput,
			$blockFilter: BlockWhereInput,
			$extrinsicsByNameCounterId: String!,
			$eventsByNameCounterId: String!
		) {
			extrinsics(limit: 1, offset: 0, where: $extrinsicFilter, orderBy: id_DESC) {
				id
			}
			blocks(limit: 1, offset: 0, where: $blockFilter, orderBy: id_DESC) {
				id
			},
			extrinsicsByNameCounter: itemsCounterById(id: $extrinsicsByNameCounterId) {
				total
			}
			eventsByNameCounter: itemsCounterById(id: $eventsByNameCounterId) {
				total
			}
		}`,
		{
			extrinsicFilter,
			blockFilter,
			extrinsicsByNameCounterId,
			eventsByNameCounterId,
		}
	);

	const result: NetworkSearchResult = {
		extrinsics: response.extrinsics,
		blocks: response.blocks,
		accounts: [],
		extrinsicsByNameTotal: response.extrinsicsByNameCounter?.total || 0,
		eventsByNameTotal: response.eventsByNameCounter?.total || 0
	};

	if (maybeAddress) {
		const encodedAddress = encodeAddress(query, network.prefix);

		console.log("encoded address", network.name, encodedAddress);

		if (query === encodedAddress) {
			result.accounts.push({
				id: decodeAddress(query)
			});
		}
	}

	return result;
}
