import { fetchGraphql } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

const unifyExtrinsics = (extrinsics: any) => {
	return {
		...extrinsics,
		items: extrinsics.items.map((extrinsic: any) => {
			const address = extrinsic.signature?.address;
			if (typeof address === "object" && address.value) {
				extrinsic.signature.address = address.value;
			}
			return extrinsic;
		})
	};
};

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsicsWithoutTotalCount(network, 1, 0, filter);
	return extrinsics?.items?.[0];
}

export async function getExtrinsicsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const response = await fetchGraphql(
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
		}`,
		{
			limit,
			offset,
			filter,
			order,
		}
	);

	console.log(unifyExtrinsics({ items: response?.extrinsics }));
	return unifyExtrinsics({ items: response?.extrinsics });
}

export async function getExtrinsics(
	network: string,
	first: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

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

	return unifyExtrinsics(unifyConnection(response?.extrinsicsConnection));
}

