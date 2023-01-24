import { ArchiveConnection } from "../model/archiveConnection";
import { fetchGraphql, fetchGraphqlCaller } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";
import { getCallerArchive } from "./archiveRegistryService";

export type CallsFilter = any;
export type CallsByAccountFilter = any;
export type CallsOrder = string | string[];


export async function getCall(network: string, filter: CallsFilter) {
	const response = await fetchGraphql<{calls: any[]}>(
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
					name
				}
				extrinsic {
					id
					version
				}
			}
		}`,
		{
			filter
		}
	);

	return response.calls[0];
}


export async function getCallsByAccount(
	network: string,
	limit: number,
	offset: number,
	address: string,
	order: CallsOrder = "id_DESC"
) {
	
	if (getCallerArchive(network)) {
		const filter = {
			callerPublicKey_eq: address,
		};
		return getCallsCaller(network, limit, offset, filter, order);
	}
	return {
		data: [],
		pagination: {
			offset,
			limit,
			hasNextPage: false,
		}
	};
}

export async function getCallsCaller(
	network: string,
	limit: number,
	offset: number,
	filter: CallsByAccountFilter,
	order: CallsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphqlCaller<{callsConnection: ArchiveConnection<any>}>(
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
						argsStr
						block {
							timestamp
							id
							height
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	// unify the response
	const data = {
		...response.callsConnection,
		edges: response.callsConnection.edges.map((item) => {
			const itemData = {
				node: {
					...item.node,
					name: item.node.palletName.concat(".", item.node.callName)
				}
			};
			return itemData;
		}),
	};

	return unifyConnection(data, limit, offset);
}

export async function getCalls(
	network: string,
	limit: number,
	offset: number,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql<{callsConnection: ArchiveConnection<any>}>(
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	return unifyConnection(response?.callsConnection, limit, offset);
}
