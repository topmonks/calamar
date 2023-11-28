import { ArchiveExtrinsic } from "../model/archive/archiveExtrinsic";
import { ExplorerSquidExtrinsic } from "../model/explorer-squid/explorerSquidExtrinsic";

import { Extrinsic } from "../model/extrinsic";
import { ItemsConnection } from "../model/itemsConnection";
import { ItemsCounter } from "../model/itemsCounter";
import { PaginationOptions } from "../model/paginationOptions";

import { decodeAddress } from "../utils/address";
import { simplifyId } from "../utils/id";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";
import { lowerFirst, upperFirst } from "../utils/string";

import { fetchArchive, fetchExplorerSquid, registerItemFragment, registerItemsConnectionFragment } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";
import { getCallRuntimeMetadata, getCallsRuntimeMetadata, getPalletsRuntimeMetadata } from "./runtimeMetadataService";
import { getLatestRuntimeSpecVersion } from "./runtimeSpecService";

export type ExtrinsicsFilter =
	undefined
	| { simplifiedId: string; }
	| { hash: string; }
	| { blockId: string; }
	| { palletName: string; }
	| { palletName: string, callName: string; }
	| { signerAddress: string; };

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(network: string, filter: ExtrinsicsFilter) {
	return getArchiveExtrinsic(network, filter);
}

export async function getExtrinsics(
	network: string,
	filter: ExtrinsicsFilter|undefined,
	order: ExtrinsicsOrder = "id_DESC",
	fetchTotalCount = true,
	pagination: PaginationOptions,
) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidExtrinsics(network, filter, order, pagination, fetchTotalCount);
	}

	return getArchiveExtrinsics(network, filter, order, pagination, fetchTotalCount);
}

export async function normalizeExtrinsicName(network: string, name: string) {
	let [palletName = "", callName = ""] = name.toLowerCase().split(".");

	const latestRuntimeSpecVersion = await getLatestRuntimeSpecVersion(network);

	const pallets = await getPalletsRuntimeMetadata(network, latestRuntimeSpecVersion);
	const pallet = await pallets.and(it => it.name.toLowerCase() === palletName).first();

	const calls = pallet && await getCallsRuntimeMetadata(network, latestRuntimeSpecVersion, pallet.name);
	const call = await calls?.and(it => it.name.toLowerCase() === callName).first();

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	palletName = pallet?.name || upperFirst(palletName);
	callName = call?.name || lowerFirst(callName);

	return {
		pallet: palletName,
		call: callName
	};
}

/*** PRIVATE ***/

registerItemFragment("ArchiveExtrinsic", "Extrinsic", `
	id
	hash
	call {
		name
		args
	}
	block {
		id
		hash
		height
		timestamp
		spec {
			specVersion
		}
	}
	signature
	indexInBlock
	success
	tip
	fee
	error
	version
`);

registerItemFragment("ExplorerSquidExtrinsic", "Extrinsic", `
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
`);

registerItemsConnectionFragment("ArchiveExtrinsicsConnection", "ExtrinsicsConnection", "...ArchiveExtrinsic");
registerItemsConnectionFragment("ExplorerSquidExtrinsicsConnection", "ExtrinsicsConnection", "...ExplorerSquidExtrinsic");

async function getArchiveExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const response = await fetchArchive<{extrinsics: ArchiveExtrinsic[]}>(
		network,
		`query ($filter: ExtrinsicWhereInput) {
			extrinsics(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				...ArchiveExtrinsic
			}
		}`,
		{
			filter: extrinsicFilterToArchiveFilter(filter),
		}
	);

	return response.extrinsics[0] && unifyArchiveExtrinsic(response.extrinsics[0], network);
}

async function getArchiveExtrinsics(
	network: string,
	filter: ExtrinsicsFilter|undefined,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchArchive<{ extrinsicsConnection: ItemsConnection<ArchiveExtrinsic> }>(
		network,
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				...ArchiveExtrinsicsConnection
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first,
			after,
			filter: extrinsicFilterToArchiveFilter(filter),
			order,
		}
	);

	return extractConnectionItems(
		response.extrinsicsConnection,
		pagination,
		unifyArchiveExtrinsic,
		network
	);
}

async function getExplorerSquidExtrinsics(
	network: string,
	filter: ExtrinsicsFilter|undefined,
	order: ExtrinsicsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchExplorerSquid<{ extrinsicsConnection: ItemsConnection<ExplorerSquidExtrinsic> }>(
		network,
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				...ExplorerSquidExtrinsicsConnection
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first,
			after,
			filter: extrinsicFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	return extractConnectionItems(
		response.extrinsicsConnection,
		pagination,
		unifyExplorerSquidExtrinsic,
		network
	);
}

/**
 * Get simplified version of extrinsic ID
 * which will be displayed to the user.
 *
 * It doesn't include block hash and parts have no leading zeros.
 *
 * examples:
 * - 0020537612-000001-5800a -> 20537612-1
 */
export function simplifyExtrinsicId(id: string) {
	return simplifyId(id, /\d{10}-\d{6}-[^-]{5}/, 2);
}

export async function unifyArchiveExtrinsic(extrinsic: ArchiveExtrinsic, network: string): Promise<Extrinsic> {
	const [palletName, callName] = extrinsic.call.name.split(".") as [string, string];
	const specVersion = extrinsic.block.spec.specVersion;

	return {
		...extrinsic,
		network: getNetwork(network),
		blockId: extrinsic.block.id,
		blockHeight: extrinsic.block.height,
		timestamp: extrinsic.block.timestamp,
		callName,
		palletName,
		args: extrinsic.call.args,
		signer: extrinsic.signature?.address?.value || extrinsic.signature?.address || null,
		signature: extrinsic.signature?.signature?.value || extrinsic.signature?.signature || null,
		fee: extrinsic.fee ? BigInt(extrinsic.fee) : null,
		tip: extrinsic.tip ? BigInt(extrinsic.tip) : null,
		specVersion,
		metadata: {
			call: await getCallRuntimeMetadata(network, specVersion, palletName, callName)
		}
	};
}

export async function unifyExplorerSquidExtrinsic(extrinsic: ExplorerSquidExtrinsic, network: string): Promise<Extrinsic> {
	const {palletName, callName} = extrinsic.mainCall;
	const specVersion = extrinsic.block.specVersion;

	return {
		...extrinsic,
		network: getNetwork(network),
		hash: extrinsic.extrinsicHash,
		blockId: extrinsic.block.id,
		blockHeight: extrinsic.block.height,
		timestamp: extrinsic.block.timestamp,
		callName: extrinsic.mainCall.callName,
		palletName: extrinsic.mainCall.palletName,
		args: null,
		signer: extrinsic.signerPublicKey,
		signature: null, // TODO is present in archive but not here
		error: extrinsic.error && JSON.parse(extrinsic.error),
		fee: extrinsic.fee ? BigInt(extrinsic.fee) : null,
		tip: extrinsic.tip ? BigInt(extrinsic.tip) : null,
		specVersion,
		metadata: {
			call: await getCallRuntimeMetadata(network, specVersion, palletName, callName)
		}
	};
}

export async function getExtrinsicMetadata(extrinsic: Omit<Extrinsic, "metadata">): Promise<Extrinsic["metadata"]> {
	return {
		call: await getCallRuntimeMetadata(extrinsic.network.name, extrinsic.specVersion, extrinsic.palletName, extrinsic.callName)
	};
}

export function extrinsicFilterToArchiveFilter(filter?: ExtrinsicsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		const [blockHeight = "", indexInBlock = ""] = filter.simplifiedId.split("-");

		return {
			block: {
				height_eq: parseInt(blockHeight),
			},
			indexInBlock_eq: parseInt(indexInBlock)
		};
	}

	if ("hash" in filter) {
		return {
			hash_eq: filter.hash
		};
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("palletName" in filter) {
		return {
			call: {
				name_eq: ("callName" in filter)
					? `${filter.palletName}.${filter.callName}`
					: filter.palletName
			}
		};
	}

	if ("signerAddress" in filter) {
		const publicKey = decodeAddress(filter.signerAddress);

		return {
			OR: [
				{ signature_jsonContains: `{"address": "${publicKey}" }` },
				{ signature_jsonContains: `{"address": { "value": "${publicKey}"} }` },
			],
		};
	}
}

export function extrinsicFilterToExplorerSquidFilter(filter?: ExtrinsicsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		const [blockHeight = "", indexInBlock = ""] = filter.simplifiedId.split("-");

		return {
			blockNumber_eq: parseInt(blockHeight),
			indexInBlock_eq: parseInt(indexInBlock)
		};
	}

	if ("hash" in filter) {
		return {
			extrinsicHash_eq: filter.hash
		};
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("palletName" in filter) {
		return {
			mainCall: "callName" in filter
				? {
					palletName_eq: filter.palletName,
					callName_eq: filter.callName
				}
				: {
					palletName_eq: filter.palletName
				}
		};
	}

	if ("signerAddress" in filter) {
		const publicKey = decodeAddress(filter.signerAddress);

		return {
			signerPublicKey_eq: publicKey
		};
	}
}
