import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type BlocksFilter = {
  id?: string;
  hash?: string;
  isSigned?: boolean;
  height?: number;
};

const getBlocks = async (
  limit: Number,
  offset: Number,
  filter: BlocksFilter,
  fields: string[] = ["id", "hash", "height", "created_at"]
) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_block(limit: ${limit}, offset: ${offset}, order_by: {height: desc},
     where: {${where}}) {
        ${fields.map((field) => `${field} `)}
      }}`);
  return response.substrate_block;
};

export { getBlocks };
