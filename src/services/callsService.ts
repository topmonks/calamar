import { ArchiveCall } from "../model/archive/archiveCall";
import { ExplorerSquidCall } from "../model/explorer-squid/explorerSquidCall";

import { Call } from "../model/call";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { decodeAddress } from "../utils/address";
import { simplifyId } from "../utils/id";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";

import { fetchArchive, fetchExplorerSquid, registerItemFragment, registerItemsConnectionFragment } from "./fetchService";
import { getRuntimeMetadataCall } from "./runtimeMetadataService";
import { getNetwork, hasSupport } from "./networksService";

export type CallsFilter =
	undefined
	| { simplifiedId: string; }
	| { blockId: string; }
	| { extrinsicId: string; }
	| { callerAddress: string; };

export type CallsOrder = string | string[];

export async function getCall(network: string, filter: CallsFilter) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidCall(network, filter);
	}

	return getArchiveCall(network, filter);
}

export async function getCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	if(hasSupport(network, "explorer-squid")) {
		return getExplorerSquidCalls(network, filter, order, pagination);
	}

	return getArchiveCalls(network, filter, order, pagination);
}

/*** PRIVATE ***/

registerItemFragment("ArchiveCall", "Call", `
	id
	name
	success
	origin
	args
	block {
		timestamp
		id
		height
		spec {
			specVersion
		}
	}
	parent {
		id
	}
	extrinsic {
		id
		indexInBlock
	}
`);

registerItemFragment("ExplorerSquidCall", "Call", `
	id
	callName
	palletName
	success
	callerPublicKey
	parentId
	block {
		id
		height
		timestamp
		specVersion
	}
	extrinsic {
		id
		indexInBlock
	}
`);

registerItemsConnectionFragment("ArchiveCallsConnection", "CallsConnection", "...ArchiveCall");
registerItemsConnectionFragment("ExplorerSquidCallsConnection", "CallsConnection", "...ExplorerSquidCall");

async function getArchiveCall(network: string, filter: CallsFilter) {
	const response = await fetchArchive<{calls: ArchiveCall[]}>(
		network,
		`query ($filter: CallWhereInput) {
			calls(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				...ArchiveCall
			}
		}`,
		{
			filter: callsFilterToArchiveFilter(filter)
		}
	);

	return response.calls[0] && unifyArchiveCall(response.calls[0], network);
}

async function getExplorerSquidCall(network: string, filter: CallsFilter) {
	const response = await fetchExplorerSquid<{calls: ExplorerSquidCall[]}>(
		network,
		`query ($filter: CallWhereInput) {
			calls(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				...ExplorerSquidCall
			}
		}`,
		{
			filter: callsFilterToExplorerSquidFilter(filter)
		}
	);

	const data = response.calls[0] && await unifyExplorerSquidCall(response.calls[0], network);
	const call = await addCallArgs(network, data);

	return call;
}

async function getArchiveCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchArchive<{callsConnection: ItemsConnection<ArchiveCall>}>(
		network,
		`query ($first: Int!, $after: String, $filter: CallWhereInput, $order: [CallOrderByInput!]!) {
			callsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				...ArchiveCallsConnection
				totalCount
			}
		}`,
		{
			first,
			after,
			filter: callsFilterToArchiveFilter(filter),
			order,
		}
	);

	return extractConnectionItems(
		response.callsConnection,
		pagination,
		unifyArchiveCall,
		network
	);
}

async function getExplorerSquidCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchExplorerSquid<{callsConnection: ItemsConnection<ExplorerSquidCall>}>(
		network,
		`query ($first: Int!, $after: String, $filter: CallWhereInput, $order: [CallOrderByInput!]!) {
			callsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				...ExplorerSquidCallsConnection
				totalCount
			}
		}`,
		{
			first,
			after,
			filter: callsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	return extractConnectionItems(
		response.callsConnection,
		pagination,
		unifyExplorerSquidCall,
		network
	);
}

async function getArchiveCallsArgs(network: string, callsIds: string[]) {
	const response = await fetchArchive<{calls: {id: string, args: any}[]}>(
		network,
		`query($ids: [String!]) {
			calls(where: { id_in: $ids }) {
				id
				args
			}
		}`,
		{
			ids: callsIds,
		}
	);

	return response.calls.reduce((argsByCallId, call) => {
		argsByCallId[call.id] = call.args;
		return argsByCallId;
	}, {} as Record<string, any>);
}

async function addCallArgs(network: string, call: Call|undefined) {
	if (!call) {
		return undefined;
	}

	const argsByCallsId = await getArchiveCallsArgs(network, [call.id]);

	return {
		...call,
		args: argsByCallsId[call.id]
	};
}

/**
 * Get simplified version of call ID which
 * is used to be displayed to the user.
 *
 * It doesn't include block hash and parts have no leading zeros.
 *
 * examples:
 * - 0020537612-000003-5800a        -> 20537612-3
 * - 0020537612-000003-5800a-000001 -> 20537612-3-1
 */
export function simplifyCallId(id: string) {
	return simplifyId(id, /\d{10}-\d{6}-[^-]{5}(-\d{6})?/, 2);
}

async function unifyArchiveCall(call: ArchiveCall, network: string): Promise<Call> {
	const [palletName, callName] = call.name.split(".") as [string, string];
	const specVersion = call.block.spec.specVersion.toString();

	return {
		...call,
		network: getNetwork(network),
		callName,
		palletName,
		blockId: call.block.id,
		blockHeight: call.block.height,
		timestamp: call.block.timestamp,
		extrinsicId: call.extrinsic.id,
		specVersion,
		parentId: call.parent?.id || null,
		caller: call.origin && call.origin.kind !== "None"
			? call.origin.value.value
			: null,
		metadata: {
			call: await getRuntimeMetadataCall(network, specVersion, palletName, callName)
		}
	};
}

async function unifyExplorerSquidCall(call: ExplorerSquidCall, network: string): Promise<Call> {
	const {palletName, callName} = call;
	const specVersion = call.block.specVersion.toString();

	return {
		...call,
		network: getNetwork(network),
		blockId: call.block.id,
		blockHeight: call.block.height,
		timestamp: call.block.timestamp,
		extrinsicId: call.extrinsic.id,
		specVersion,
		parentId: call.parentId,
		caller: call.callerPublicKey,
		args: null,
		metadata: {
			call: await getRuntimeMetadataCall(network, specVersion, palletName, callName)
		}
	};
}

function callsFilterToArchiveFilter(filter?: CallsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		console.log(filter);
		const [blockHeight = "", indexInBlock = "", childIndex = ""] = filter.simplifiedId.split("-");

		const squidFilter: any = {
			block: {
				height_eq: parseInt(blockHeight),
			},
			extrinsic: {
				indexInBlock_eq: parseInt(indexInBlock)
			},
			parent: {
				id_isNull: true
			}
		};

		if (childIndex) {
			squidFilter.parent.id_isNull = false;
			squidFilter.id_endsWith = childIndex.toString();
		}

		return squidFilter;
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("extrinsicId" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId
			}
		};
	}

	if ("callerAddress" in filter) {
		console.warn("Filtering calls by caller public key in archive is not implemented");
		return {
			id_eq: "" // failing filter
		};
	}


	return filter;
}

function callsFilterToExplorerSquidFilter(filter?: CallsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		console.log(filter);
		const [blockHeight = "", indexInBlock = "", childIndex = ""] = filter.simplifiedId.split("-");

		const squidFilter: any = {
			block: {
				height_eq: parseInt(blockHeight),
			},
			extrinsic: {
				indexInBlock_eq: parseInt(indexInBlock)
			},
			parentId_isNull: true
		};

		if (childIndex) {
			squidFilter.parentId_isNull = false;
			squidFilter.id_endsWith = childIndex.toString();
		}

		return squidFilter;
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("extrinsicId" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId
			}
		};
	}

	if ("callerAddress" in filter) {
		const publicKey = decodeAddress(filter.callerAddress);

		return {
			callerPublicKey_eq: publicKey
		};
	}

	return filter;
}
