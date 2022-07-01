import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type ExtrinsicsFilter = {
  id?: string;
  blockId?: string;
  hash?: string;
  isSigned?: boolean;
};

const getExtrinsics = async (
  limit: Number,
  offset: Number,
  filter: ExtrinsicsFilter,
  fields = [
    "id",
    "section",
    "method",
    "signer",
    "hash",
    "created_at",
    "blockId",
    "blockHash",
  ]
) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_extrinsic(limit: ${limit}, offset: ${offset}, order_by: {blockNumber: desc},
     where: {${where}}) {
        ${fields.map((field) => `${field} `)}
      }}`);
  return response?.substrate_extrinsic;
};

export { getExtrinsics };
