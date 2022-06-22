import { fetchGraphql } from "../utils/fetchGraphql";

export type ExtrinsicFilter = {
  isSigned?: boolean;
  hash?: string;
};

export type Filter = {
  id?: string;
  section?: string;
  method?: string;
  signer?: string;
  extrinsic?: ExtrinsicFilter;
};

// create filterToWhere function
const filterToWhere = (filter: Filter): string => {
  let where = "";
  for (let key in filter) {
    // @ts-ignore
    if (filter[key] instanceof Object) {
      where += `${key}: {`;
      // @ts-ignore
      where += filterToWhere(filter[key]);
      where += `}`;
    } else {
      // @ts-ignore
      if (filter[key] !== "") {
        // @ts-ignore
        where += `${key}: {_eq: ${filter[key]}}, `;
      }
    }
  }
  // where = where.slice(0, -2);
  where = where.replace(/"([^(")"]+)":/g, "$1:");
  return where;
};

const getEvents = async (limit: Number, offset: Number, filter: Filter) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_event(limit: ${limit}, offset: ${offset}, order_by: {blockTimestamp: desc},
     where: {${where}}) {
        id
        section
        method
        params
        extrinsic {
          hash
          signer  
          isSigned
        }
      }}`);
  return response.substrate_event;
};

export { getEvents };
