import { fetchGraphql } from "../utils/fetchGraphql";

export type EventsFilter = any;
export type EventsOrder = string | string[];

export async function getEvent(network: string, filter: EventsFilter) {
	const events = await getEvents(network, 1, 0, filter);
	return events[0];
}

export async function getEvents(
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
