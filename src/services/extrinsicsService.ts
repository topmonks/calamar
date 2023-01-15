import { ArchiveConnection } from "../model/archiveConnection";
import { fetchGraphql, fetchGraphqlCaller } from "../utils/fetchGraphql";
import { decodeMetadata } from "../utils/decodeMetadata";
import { lowerFirst, upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";

import { getLatestRuntimeSpec } from "./runtimeService";

export type ExtrinsicsFilter = any;
export type ExtrinsicsByAccountFilter = any;

export type ExtrinsicsOrder = string | string[];

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsicsWithoutTotalCount(network, 1, 0, filter);
	return extrinsics.data[0];
}

export async function getExtrinsicsByAccount(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsByAccountFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphqlCaller<{ extrinsicsConnection: ArchiveConnection<any> }>(
		network,
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						block {
							id
							hash
							height
							timestamp
						}
						calls {
							callName
						}
						indexInBlock
						success
						tip
						fee
						signerPublicKey
        				signerAccount
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	// unify the response
	const data = {
		...response.extrinsicsConnection,
		edges: response.extrinsicsConnection.edges.map((item) => {
			const itemData = {
				node: {
					...item.node,
					call: {
						name: item.node.calls[0].callName
					},
				}
			};
			return itemData;
		}),
	};
	
	return unifyConnection(data, limit, offset);
}

export async function getExtrinsicsByName(
	network: string,
	limit: number,
	offset: number,
	name: string,
	order: ExtrinsicsOrder = "id_DESC"
) {
	let [pallet, call = ""] = name.split(".");

	// try to fix casing according to latest runtime spec
	const runtimeSpec = await getLatestRuntimeSpec(network);

	const runtimePallet = runtimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeCall = runtimePallet?.calls.find(it => it.name.toLowerCase() === call.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	pallet = runtimePallet?.name.toString() || upperFirst(pallet);
	call = runtimeCall?.name.toString() || lowerFirst(call);

	const filter = {
		call: {
			name_eq: `${pallet}.${call}`
		}
	};

	return getExtrinsicsWithoutTotalCount(network, limit, offset, filter, order);
}

export async function getExtrinsicsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const response = await fetchGraphql<{ extrinsics: any }>(
		network,
		`query ($limit: Int!, $offset: Int!, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]) {
			extrinsics(limit: $limit, offset: $offset, where: $filter, orderBy: $order) {
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
			}
		}`,
		{
			limit: limit + 1, // get one item more to test if next page exists
			offset,
			filter,
			order,
		}
	);

	const items = response.extrinsics;
	const hasNextPage = items.length > limit;

	if (hasNextPage) {
		// remove testing item from next page
		items.pop();
	}

	return {
		data: items,
		pagination: {
			offset,
			limit,
			hasNextPage
		}
	};
}

export async function getExtrinsics(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql<{ extrinsicsConnection: ArchiveConnection<any> }>(
		network,
		`query ($first: Int!, $after: String, $filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	return unifyConnection(response.extrinsicsConnection, limit, offset);
}

