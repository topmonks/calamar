import { fetchGraphql } from "../utils/fetchGraphql";

export type BlocksFilter = any; /*Filter<{
	id: string;
	hash: string;
	isSigned: boolean;
	height: number;
}>;*/

export async function getBlock(network: string, filter: BlocksFilter) {
	const blocks = await getBlocks(network, 1, 0, filter);
	return blocks?.[0];
}

export async function getBlocks(
	network: string,
	limit: number,
	offset: number,
	filter: BlocksFilter
) {
	const response = await fetchGraphql(
		network,
		`
			query ($limit: Int!, $offset: Int!, $filter: BlockWhereInput) {
				blocks(limit: $limit, offset: $offset, where: $filter, orderBy: id_DESC) {
					id
					hash
					height
					timestamp
					parentHash
					validator
					spec {
						specVersion
					}
				}
			}
		`,
		{
			limit,
			offset,
			filter,
		}
	);

	return response.blocks;
}
