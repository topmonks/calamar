import { ArchiveConnection } from "../model/archiveConnection";
import { Call } from "../model/call";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { unifyConnection } from "../utils/unifyConnection";
import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getExplorerSquid } from "./networksService";

export type CallsFilter = any;
export type CallsByAccountFilter = any;
export type CallsOrder = string | string[];

export async function getCall(network: string, filter: CallsFilter) {
	const response = await fetchArchive<{calls: Omit<Call, "runtimeSpec">[]}>(
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

	return addRuntimeSpec(
		network,
		response.calls[0],
		it => it.block.spec.specVersion
	);
}

export async function getCallsByAccount(
	network: string,
	address: string,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	
	if (getExplorerSquid(network)) {
		const filter = {
			callerPublicKey_eq: address,
		};
		return getCalls(network, filter, order, pagination);
	}
	return {
		data: [],
		pagination: {
			...pagination,
			hasNextPage: false,
		}
	};
}

export async function getCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	if(getExplorerSquid(network)) {
		const response = await fetchExplorerSquid<{callsConnection: ArchiveConnection<any>}>(
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
							specVersion
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
						name: item.node.palletName.concat(".", item.node.callName),
						block: {
							...item.node.block,
							spec: {
								specVersion: item.node.block.specVersion,
							}
						}
					}
				};
				return itemData;
			}),
		};

		return addRuntimeSpecs(
			network,
			unifyConnection(
				data,
				pagination.limit,
				pagination.offset
			),
			it => it.block.spec.specVersion
		);
	}

	const response = await fetchArchive<{callsConnection: ArchiveConnection<any>}>(
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
			filter,
			order,
		}
	);

	return addRuntimeSpecs(
		network,
		unifyConnection(
			response?.callsConnection,
			pagination.limit,
			pagination.offset
		),
		it => it.block.spec.specVersion
	);
}
