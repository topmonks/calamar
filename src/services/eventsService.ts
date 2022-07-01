import { fetchGraphql } from "../utils/fetchGraphql";
import { ExtrinsicsFilter } from "./extrinsicsService";
import { filterToWhere } from "../utils/filterToWhere";

export type EventsFilter = {
  id?: string;
  section?: string;
  method?: string;
  signer?: string;
  extrinsic?: ExtrinsicsFilter;
};

const getEvents = async (
  limit: Number,
  offset: Number,
  filter: EventsFilter
) => {
  const where = filterToWhere(filter);

  const response =
    await fetchGraphql(`query MyQuery { substrate_event(limit: ${limit}, offset: ${offset}, order_by: {blockTimestamp: desc},
     where: {${where}}) {
        id
        section
        method
        params
        created_at
        extrinsic {
          id
          hash
          signer
          isSigned
        }
      }}`);
  return response.substrate_event;
};

export { getEvents };
