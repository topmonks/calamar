import { Filter } from "../model/filter";
import { Order } from "../model/order";
import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type ExtrinsicsFilter = Filter<{
  id: string;
  blockId: string;
  hash: string;
  isSigned: boolean;
  signer: string;
}>;

const getExtrinsics = async (
  limit: Number,
  offset: Number,
  filter?: ExtrinsicsFilter,
  order?: Order,
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
  const orderBy = Object.entries(order || {})
    .map((e) => `${e[0]}: ${e[1]}`)
    .join(", ");

  const response =
    await fetchGraphql(`query MyQuery { substrate_extrinsic(limit: ${limit}, offset: ${offset}, order_by: {${orderBy}},
     where: {${where}}) {
        ${fields.map((field) => `${field} `)}
      }}`);
  return response?.substrate_extrinsic;
};

export { getExtrinsics };
