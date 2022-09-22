import { fetchGraphql } from "../utils/fetchGraphql";

export type ExtrinsicsFilter = any;
export type ExtrinsicsOrder = string | string[];

const unifyExtrinsics = (extrinsics: any) => {
	return (
		extrinsics &&
		extrinsics.map((extrinsic: any) => {
			const address = extrinsic.signature?.address;
			if (typeof address === "object" && address.value) {
				extrinsic.signature.address = address.value;
			}
			return extrinsic;
		})
	);
};

export async function getExtrinsic(network: string, filter?: ExtrinsicsFilter) {
	const extrinsics = await getExtrinsics(network, 1, 0, filter);
	return extrinsics?.[0];
}

export async function getExtrinsics(
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

	return unifyExtrinsics(response?.extrinsics);
}
