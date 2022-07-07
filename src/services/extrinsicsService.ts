import { Order } from "../model/order";
import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type ExtrinsicsFilter = any; /*Filter<{
  id: string;
  blockId: string;
  hash: string;
  isSigned: boolean;
  signer: string;
  name: string;
  section: string;
  method: string;
  substrate_events: Filter<{
    name: string;
  }>;
}>;*/

export async function getExtrinsicById(id: string) {
  const response = await fetchGraphql(
    `
      query ($id: ID!) {
        extrinsicById(id: $id) {
          id
          hash
          call {
            name
            args
          }
          block {
            id
            hash
            timestamp
          }
          signature
        }
      }
    `,
    {
      id,
    }
  );

  return response?.extrinsicById;
}

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

  const response = await fetchGraphql(
    `query ($limit: Int!, $offset: Int!) {
      extrinsics(limit: $limit, offset: $offset, where: {${where}}) {
        id
        hash
        call {
          name
          args
        }
        block {
          id
          hash
          timestamp
        }
        signature
      }
    }`,
    {
      limit,
      offset,
    }
  );

  return response?.extrinsics;
};

export { getExtrinsics };
