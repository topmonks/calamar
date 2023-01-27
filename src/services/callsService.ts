import { ArchiveConnection } from "../model/archiveConnection";
import { Call } from "../model/call";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { unifyConnection } from "../utils/unifyConnection";

import { fetchArchive } from "./fetchService";

export type CallsFilter = any;
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

export async function getCalls(
	network: string,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC",
	pagination: PaginationOptions
): Promise<ItemsResponse<Call>> {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{callsConnection: ArchiveConnection<Omit<Call, "runtimeSpec">>}>(
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
