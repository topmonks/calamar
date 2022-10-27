import { fetchGraphql } from "../utils/fetchGraphql";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

const unifyExtrinsics = (extrinsics: any) => {
	return (
		extrinsics &&
		extrinsics.edges.map((item: any) => {
			const extrinsic = item.node;
			const address = extrinsic.signature?.address;
			if (typeof address === "object" && address.value) {
				item.node.signature.address = address.value;
			}
			return item;
		})
	);
};

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsics(network, 1, 0, filter);
	if (extrinsics?.edges.length > 0) return extrinsics.edges?.[0].node;
	return undefined;
}

export async function getExtrinsics(
	network: string,
	first: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	console.warn(filter);

	const response = await fetchGraphql(
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
						timestamp
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
				}
		}`,
		{
			first,
			after,
			filter,
			order,
		}
	);

	return {
		...response.extrinsicsConnection,
		edges: unifyExtrinsics(response?.extrinsicsConnection),
	};
}

export async function getTotalCount(
	network: string,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {

	const response = await fetchGraphql(
		network,
		`query ($filter: ExtrinsicWhereInput, $order: [ExtrinsicOrderByInput!]!) {
			extrinsicsConnection(orderBy: $order, where: $filter) {
				totalCount
			}
		}`,
		{
			filter,
			order,
		}
	);

	if (response?.extrinsicsConnection) return response.extrinsicsConnection?.totalCount;
	return undefined;
}


