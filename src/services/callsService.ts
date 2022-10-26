import { fetchGraphql } from "../utils/fetchGraphql";

export type CallsFilter = any;
export type CallsOrder = string | string[];


export async function getCall(network: string, id: string) {
	const response = await fetchGraphql(
		network,
		`query ($id: String!) {
			callById(id: $id) {
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
			id,
		}
	);
	return response.callById;
}

export async function getCalls(
	network: string,
	first: number,
	offset: number,
	filter: CallsFilter,
	order: CallsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql(
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
			filter,
			order,
		}
	);

	return response?.callsConnection;
}


