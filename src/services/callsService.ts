import { ArchiveCall } from "../model/archive/archiveCall";
import { ExplorerSquidCall } from "../model/explorer-squid/explorerSquidCall";

import { Call } from "../model/call";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";

import { decodeAddress } from "../utils/address";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getCallRuntimeMetadata } from "./runtimeMetadataService";
import { getNetwork, hasSupport } from "./networksService";

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

	return response.calls[0] && unifyArchiveCall(response.calls[0], network);
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
			first,
			after,
			filter: callsFilterToArchiveFilter(filter),
			order,
		}
	);

	return extractConnectionItems(response?.callsConnection, unifyArchiveCall, network);
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
			first,
			after,
			filter: callsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	return extractConnectionItems(response.callsConnection, unifyExplorerSquidCall, network);
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

async function unifyArchiveCall(call: ArchiveCall, network: string): Promise<Call> {
	const [palletName, callName] = call.name.split(".") as [string, string];
	const specVersion = call.block.spec.specVersion;

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
		args: null,
		metadata: {
			call: await getCallRuntimeMetadata(network, specVersion, palletName, callName)
		}
	};
}

async function unifyExplorerSquidCall(call: ExplorerSquidCall, network: string): Promise<Call> {
	const {palletName, callName} = call;
	const specVersion = call.block.specVersion;

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
			call: await getCallRuntimeMetadata(network, specVersion, palletName, callName)
		}
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
