import { ArchiveBlock } from "../model/archive/archiveBlock";
import { Block } from "../model/block";
import { ExplorerSquidBlock } from "../model/explorer-squid/explorerSquidBlock";
import { addRuntimeSpec } from "../utils/addRuntimeSpec";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getExplorerSquid, hasSupport } from "./networksService";

export type BlocksFilter =
	{ id_eq: string; }
	| { hash_eq: string; }
	| { height_eq: number; };

export async function getBlock(network: string, filter: BlocksFilter) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidBlock(network, filter);
	}

	return getArchiveBlock(network, filter);
}

/*** PRIVATE ***/

async function getArchiveBlock(network: string, filter: BlocksFilter) {
	const response = await fetchArchive<{blocks: ArchiveBlock[]}>(
		network,
		`query ($filter: BlockWhereInput) {
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
		}`,
		{
			filter: blocksFilterToArchiveFilter(filter),
		}
	);

	const data = response.blocks[0] && unifyArchiveBlock(response.blocks[0]);
	const block = await addRuntimeSpec(network, data, it => it.specVersion);

	return block;
}

async function getExplorerSquidBlock(network: string, filter: BlocksFilter) {
	const response = await fetchExplorerSquid<{blocks: ExplorerSquidBlock[]}>(
		network,
		`query ($filter: BlockWhereInput) {
			blocks(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				id
				hash
				height
				timestamp
				parentHash
				validator
				specVersion
			}
		}`,
		{
			filter: blocksFilterToExplorerSquidFilter(filter),
		}
	);

	const data = response.blocks[0] && unifyExplorerSquidBlock(response.blocks[0]);
	const block = await addRuntimeSpec(network, data, it => it.specVersion);

	return block;
}

function unifyArchiveBlock(block: ArchiveBlock): Omit<Block, "runtimeSpec"> {
	return {
		...block,
		specVersion: block.spec.specVersion
	};
}

function unifyExplorerSquidBlock(block: ExplorerSquidBlock): Omit<Block, "runtimeSpec"> {
	return block;
}

function blocksFilterToArchiveFilter(filter?: BlocksFilter) {
	if (!filter) {
		return undefined;
	}

	return filter;
}

function blocksFilterToExplorerSquidFilter(filter?: BlocksFilter) {
	if (!filter) {
		return undefined;
	}

	return filter;
}

