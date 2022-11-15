import { ArchiveConnection } from "../model/archiveConnection";
import { fetchGraphql } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";

export type CallsFilter = any;
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
