import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type BlocksFilter = any; /*Filter<{
  id: string;
  hash: string;
  isSigned: boolean;
  height: number;
}>;*/

export async function getBlock(filter: BlocksFilter) {
  const blocks = await getBlocks(1, 0, filter);
  return blocks?.[0];
}

export async function getBlocks(
  limit: Number,
  offset: Number,
  filter: BlocksFilter
) {
  const response = await fetchGraphql(
    `
      query ($limit: Int!, $offset: Int!, $filter: BlockWhereInput) {
        blocks(limit: $limit, offset: $offset, where: $filter, orderBy: id_DESC) {
          id
          hash
          height
          timestamp
          parentHash
          validator
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
