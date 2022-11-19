import { ArchiveConnection } from "../model/archiveConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { fetchGraphql } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

function unifyExtrinsics<T extends ItemsResponse>(response: T) {
	console.log(JSON.stringify(response.data));
	return {
		...response,
		data: response.data.map((extrinsic: any) => {
			const address = extrinsic.signature?.address;
			if (typeof address === "object" && address.value) {
				extrinsic.signature.address = address.value;
			}
			return extrinsic;
		})
	};
}

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsicsWithoutTotalCount(network, 1, 0, filter);
	return extrinsics.data[0];
}

export async function getExtrinsicsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const response = await fetchGraphql<{extrinsics: any}>(
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

	return unifyExtrinsics({
		data: items,
		pagination: {
			offset,
			limit,
			hasNextPage
		}
	});
}

export async function getExtrinsics(
	network: string,
	limit: number,
	offset: number,
	filter?: ExtrinsicsFilter,
	order: ExtrinsicsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql<{extrinsicsConnection: ArchiveConnection<any>}>(
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	return unifyExtrinsics(unifyConnection(response.extrinsicsConnection, limit, offset));
}

