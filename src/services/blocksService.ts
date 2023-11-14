import { ArchiveBlock } from "../model/archive/archiveBlock";
import { Block } from "../model/block";
import { ExplorerSquidBlock } from "../model/explorer-squid/explorerSquidBlock";
import { ItemsConnection } from "../model/itemsConnection";
import { PaginationOptions } from "../model/paginationOptions";
import { simplifyId } from "../utils/id";

import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";

export type BlocksFilter =
	undefined
	| { id: string; }
	| { simplifiedId: string; }
	| { hash: string; }
	| { height: number; };

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

	const block = response.blocks[0] && unifyArchiveBlock(response.blocks[0], network);

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

	const block = response.blocks[0] && unifyExplorerSquidBlock(response.blocks[0], network);

	return block;
}

async function getArchiveBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order: BlocksOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const {first, after} = paginationToConnectionCursor(pagination);

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
			first,
			after,
			filter: blocksFilterToArchiveFilter(filter),
			order,
		}
	);

	const blocks = extractConnectionItems(response.blocksConnection, unifyArchiveBlock, network);

	return blocks;
}

async function getExplorerSquidBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order: BlocksOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const {first, after} = paginationToConnectionCursor(pagination);

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
			first,
			after,
			filter: blocksFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const blocks = extractConnectionItems(response.blocksConnection, unifyExplorerSquidBlock, network);

	return blocks;
}

/**
 * Get simplified version of block ID
 * which will be displayed to the user.
 *
 * It doesn't include block hash and parts have no leading zeros.
 *
 * examples:
 * - 0020537612-5800a -> 20537612
 */
export function simplifyBlockId(id: string) {
	return simplifyId(id, /\d{10}-[^-]{5}/, 1);
}

function unifyArchiveBlock(block: ArchiveBlock, network: string): Block {
	return {
		...block,
		network: getNetwork(network),
		specVersion: block.spec.specVersion
	};
}

export function unifyExplorerSquidBlock(block: ExplorerSquidBlock, network: string): Block {
	return {
		...block,
		network: getNetwork(network),
	};
}

export function blocksFilterToArchiveFilter(filter?: BlocksFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		return {
			height_eq: parseInt(filter.simplifiedId)
		};
	}

	return filter;
}

export function blocksFilterToExplorerSquidFilter(filter?: BlocksFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		return {
			height_eq: parseInt(filter.simplifiedId)
		};
	}

	return filter;
}

