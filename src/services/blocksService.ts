import { ArchiveBlock } from "../model/archiveBlock";
import { Block } from "../model/block";
import { ExplorerSquidBlock } from "../model/explorerSquidBlock";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { extractConnectionItems } from "../utils/extractConnectionItems";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { hasSupport } from "./networksService";

export type BlocksFilter =
	{ id_eq: string; }
	| { hash_eq: string; }
	| { height_eq: number; };

export type BlocksOrder = string | string[];

export async function getBlock(network: string, filter: BlocksFilter) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidBlock(network, filter);
	}

	return getArchiveBlock(network, filter);
}

export async function getBlocks(
	network: string,
	filter: BlocksFilter|undefined,
	order: BlocksOrder = "id_DESC",
	pagination: PaginationOptions,
) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidBlocks(network, filter, order, pagination);
	}

	return getArchiveBlocks(network, filter, order, pagination);
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

async function getArchiveBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order: BlocksOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{blocksConnection: ItemsConnection<ArchiveBlock>}>(
		network,
		`query ($first: Int!, $after: String, $filter: BlockWhereInput, $order: [BlockOrderByInput!]!) {
			blocksConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
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
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${filter !== undefined ? "totalCount" : "" }
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: blocksFilterToArchiveFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response.blocksConnection, pagination, unifyArchiveBlock);
	const blocks = await addRuntimeSpecs(network, data, it => it.specVersion);

	return blocks;
}

async function getExplorerSquidBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order: BlocksOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchExplorerSquid<{blocksConnection: ItemsConnection<ExplorerSquidBlock>}>(
		network,
		`query ($first: Int!, $after: String, $filter: BlockWhereInput, $order: [BlockOrderByInput!]!) {
			blocksConnection(first: $first, after: $after, where: $filter, orderBy: $order) {
				edges {
					node {
						id
						hash
						height
						timestamp
						parentHash
						validator
						specVersion
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${filter !== undefined ? "totalCount" : "" }
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: blocksFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response.blocksConnection, pagination, unifyExplorerSquidBlock);
	
	const blocks = await addRuntimeSpecs(network, data, it => it.specVersion);

	return blocks;
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

