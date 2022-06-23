import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type ExtrinsicsFilter = {
  isSigned?: boolean;
  hash?: string;
};

const getExtrinsics = async (
  limit: Number,
  offset: Number,
  filter: ExtrinsicsFilter
) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_extrinsic(limit: ${limit}, offset: ${offset}, order_by: {blockNumber: desc},
     where: {${where}}) {
        id
        section
        method
        signer
        created_at
      }}`);
  return response.substrate_extrinsic;
};

export { getExtrinsics };
