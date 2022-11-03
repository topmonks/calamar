import { fetchGraphql } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";

export type EventsFilter = any;
export type EventsOrder = string | string[];

export async function getEvent(network: string, id: string) {
	const response = await fetchGraphql(
		network,
		`
			query ($id: String!) {
				eventById(id: $id) {
					id
					name
					block {
						id
						height
						timestamp
						spec {
							specVersion
						}
					}
					extrinsic {
						id
					}
					call {
						id
					}
					args
				}
			}
		`,
		{
			id,
		}
	);

	return response.eventById;
}

export async function getEventsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const response = await fetchGraphql(
		network,
		`
			query ($limit: Int!, $offset: Int!, $filter: EventWhereInput, $order: [EventOrderByInput!]) {
				events(limit: $limit, offset: $offset, where: $filter, orderBy: $order) {
					id
					name
					block {
						id
						height
						timestamp
						spec {
							specVersion
						}
					}
					extrinsic {
						id
					}
					call {
						id
					}
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

export async function getEvents(
	network: string,
	first: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql(
		network,
		`
			query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
				eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
					edges {
					  node {
						id
						name
						block {
						  id
						  height
						  timestamp
						  spec {
							specVersion
						  }
						}
						extrinsic {
						  id
						}
						call {
						  id
						}
						args
					  }
					}
					pageInfo {
					  endCursor
					  hasNextPage
					  hasPreviousPage
					  startCursor
					}
					totalCount
				  }
			}
		`,
		{
			first,
			after,
			filter,
			order,
		}
	);

	return unifyConnection(response?.eventsConnection);
}
