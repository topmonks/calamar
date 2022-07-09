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

export async function getEvent(filter: EventsFilter) {
  const events = await getEvents(1, 0, filter);
  return events?.[0];
}

export async function getEvents(
  limit: Number,
  offset: Number,
  filter: EventsFilter
) {
  const response = await fetchGraphql(
    `
      query ($limit: Int!, $offset: Int!, $filter: EventWhereInput) {
        events(limit: $limit, offset: $offset, where: $filter) {
          id
          name
          args
          pos
          indexInBlock
          extrinsic {
            hash
          }
        }
      }
    `,
    {
      limit,
      offset,
      filter,
    }
  );

  return response?.events;
}
