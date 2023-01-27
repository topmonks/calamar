import { Block } from "../model/block";

import { addRuntimeSpec } from "../utils/addRuntimeSpec";
import { fetchGraphql } from "../utils/fetchGraphql";

export type BlocksFilter = any;

export async function getBlock(network: string, filter: BlocksFilter) {
	const response = await fetchGraphql<{blocks: Omit<Block, "runtimeSpec">[]}>(
		network,
		`
			query ($filter: BlockWhereInput) {
				blocks(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
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
			filter,
		}
	);

	return addRuntimeSpec(
		network,
		response.blocks[0],
		it => it.spec.specVersion
	);
}
