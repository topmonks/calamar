import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type BlocksFilter = {
  id?: string;
  hash?: string;
  isSigned?: boolean;
};

const getBlocks = async (
  limit: Number,
  offset: Number,
  filter: BlocksFilter
) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_block(limit: ${limit}, offset: ${offset}, order_by: {height: desc},
     where: {${where}}) {
        id
        hash
        height
        created_at
      }}`);
  return response.substrate_block;
};

export { getBlocks };
