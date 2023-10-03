import { ArchiveCall } from "../model/archive/archiveCall";
import { ExplorerSquidCall } from "../model/explorer-squid/explorerSquidCall";

import { Call } from "../model/call";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { addItemMetadata, addItemsMetadata } from "../utils/addMetadata";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { decodeAddress } from "../utils/formatAddress";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getCallRuntimeMetadata } from "./runtimeMetadataService";
import { hasSupport } from "./networksService";

export type CallsFilter =
	{ id_eq: string; }
	| { blockId_eq: string; }
	| { extrinsicId_eq: string; }
	| { callerAddress_eq: string; };

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

async function getArchiveCall(network: string, filter: CallsFilter) {
	const response = await fetchArchive<{calls: ArchiveCall[]}>(
		network,
		`query ($filter: CallWhereInput) {
			calls(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
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
				}
			}
		}`,
		{
			filter: callsFilterToArchiveFilter(filter)
		}
	);

	const data = response.calls[0] && unifyArchiveCall(response.calls[0], network);
	const call = await addItemMetadata(data, getCallMetadata);

	return call;
}

async function getExplorerSquidCall(network: string, filter: CallsFilter) {
	const response = await fetchExplorerSquid<{calls: ExplorerSquidCall[]}>(
		network,
		`query ($filter: CallWhereInput) {
			calls(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
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
				}
			}
		}`,
		{
			filter: callsFilterToExplorerSquidFilter(filter)
		}
	);

	const data = response.calls[0] && unifyExplorerSquidCall(response.calls[0], network);
	const dataWithMetadata = await addItemMetadata(data, getCallMetadata);
	const call = await addCallArgs(network, dataWithMetadata);

	return call;
}

async function getArchiveCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{callsConnection: ItemsConnection<ArchiveCall>}>(
		network,
		`query ($first: Int!, $after: String, $filter: CallWhereInput, $order: [CallOrderByInput!]!) {
			callsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
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
							name
						}
						extrinsic {
							id
							version
						}
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
			first: pagination.limit,
			after,
			filter: callsFilterToArchiveFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response?.callsConnection, pagination, unifyArchiveCall, network);
	const calls = await addItemsMetadata(data, getCallMetadata);

	return calls;
}

async function getExplorerSquidCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchExplorerSquid<{callsConnection: ItemsConnection<ExplorerSquidCall>}>(
		network,
		`query ($first: Int!, $after: String, $filter: CallWhereInput, $order: [CallOrderByInput!]!) {
			callsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
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
						}
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
			first: pagination.limit,
			after,
			filter: callsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response.callsConnection, pagination, unifyExplorerSquidCall, network);
	const calls = await addItemsMetadata(data, getCallMetadata);

	return calls;
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

function unifyArchiveCall(call: ArchiveCall, network: string): Omit<Call, "metadata"> {
	const [palletName, callName] = call.name.split(".") as [string, string];

	return {
		...call,
		network,
		callName,
		palletName,
		blockId: call.block.id,
		blockHeight: call.block.height,
		timestamp: call.block.timestamp,
		extrinsicId: call.extrinsic.id,
		specVersion: call.block.spec.specVersion,
		parentId: call.parent?.id || null,
		caller: call.origin && call.origin.kind !== "None"
			? call.origin.value.value
			: null,
		args: null
	};
}

function unifyExplorerSquidCall(call: ExplorerSquidCall, network: string): Omit<Call, "metadata"> {
	return {
		...call,
		network,
		blockId: call.block.id,
		blockHeight: call.block.height,
		timestamp: call.block.timestamp,
		extrinsicId: call.extrinsic.id,
		specVersion: call.block.specVersion,
		parentId: call.parentId,
		caller: call.callerPublicKey,
		args: null
	};
}

async function getCallMetadata(call: Omit<Call, "metadata">): Promise<Call["metadata"]> {
	return {
		call: await getCallRuntimeMetadata(call.network, call.specVersion, call.palletName, call.callName)
	};
}

function callsFilterToArchiveFilter(filter?: CallsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("extrinsicId_eq" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId_eq
			}
		};
	} else if ("callerAddress_eq" in filter) {
		throw new Error("Filtering by caller public key in archive not implemented");
	}


	return filter;
}

function callsFilterToExplorerSquidFilter(filter?: CallsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("extrinsicId_eq" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId_eq
			}
		};
	} else if ("callerAddress_eq" in filter) {
		const publicKey = decodeAddress(filter.callerAddress_eq);

		return {
			callerPublicKey_eq: publicKey
		};
	}

	return filter;
}
