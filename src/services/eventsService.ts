import { fetchGraphql } from "../utils/fetchGraphql";
import { filterToWhere } from "../utils/filterToWhere";

export type EventsFilter = any; /*Filter<{
  id: string;
  name: string;
  section: string;
  method: string;
  signer: string;
  extrinsic: ExtrinsicsFilter;
}>;*/

export async function getEvents(
  limit: Number,
  offset: Number,
  filter: EventsFilter
) {
  const where = filterToWhere(filter);

  const response = await fetchGraphql(
    `
      query {
        events(limit: ${limit}, offset: ${offset}, where: {${where}}) {
          id
          name
          args
        }
      }
    `
  );

  return response?.events;
}
