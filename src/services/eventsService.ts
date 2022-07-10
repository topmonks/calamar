import { fetchGraphql } from "../utils/fetchGraphql";

export type EventsFilter = any;
export type EventsOrder = string | string[];

export async function getEvent(filter: EventsFilter) {
  const events = await getEvents(1, 0, filter);
  return events?.[0];
}

export async function getEvents(
  limit: Number,
  offset: Number,
  filter: EventsFilter,
  order: EventsOrder = "id_DESC"
) {
  const response = await fetchGraphql(
    `
      query ($limit: Int!, $offset: Int!, $filter: EventWhereInput, $order: [EventOrderByInput]) {
        events(limit: $limit, offset: $offset, where: $filter, orderBy: $order) {
          id
          name
          args
        }
      }
    `,
    {
      limit,
      offset,
      filter,
      order,
    }
  );

  return response?.events;
}
