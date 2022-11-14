import { ArchiveConnection } from "../model/archiveConnection";
import { fetchGraphql } from "../utils/fetchGraphql";
import { unifyConnection } from "../utils/unifyConnection";

export type EventsFilter = any;
export type EventsOrder = string | string[];

export async function getEvent(network: string, filter: EventsFilter) {
	const response = await fetchGraphql<{events: any}>(
		network,
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
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
		}`,
		{
			filter,
		}
	);

	return response.events[0];
}

export async function getEventsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const response = await fetchGraphql<{events: any[]}>(
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
			limit: limit + 1, // get one item more to test if next page exists
			offset,
			filter,
			order,
		}
	);

	const items = response.events;
	const hasNextPage = items.length > limit;

	if (hasNextPage) {
		// remove testing item from next page
		items.pop();
	}

	return {
		data: items,
		pagination: {
			offset,
			limit,
			hasNextPage
		}
	};
}

export async function getEvents(
	network: string,
	first: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchGraphql<{eventsConnection: ArchiveConnection<any>}>(
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
