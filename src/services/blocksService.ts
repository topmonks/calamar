import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type BlocksFilter = any; /*Filter<{
  id: string;
  hash: string;
  isSigned: boolean;
  height: number;
}>;*/

export async function getBlockById(id: string) {
  const response = await fetchGraphql(
    `query ($id: ID!) {
      blockById(id: $id) {
        id
        hash
        height
        timestamp
      }
    }`,
    {
      id,
    }
  );

  return response?.blockById;
}

const getBlocks = async (
  limit: Number,
  offset: Number,
  filter: BlocksFilter,
  fields: string[] = ["id", "hash", "height", "created_at"]
) => {
  const where = filterToWhere(filter);

  const response = await fetchGraphql(
    `
      query MyQuery {
        blocks(limit: ${limit}, offset: ${offset}, where: {${where}}) {
          id
          hash
          height
          timestamp
        }
      }
    `
  );
  return response.blocks;
};

export { getBlocks };
