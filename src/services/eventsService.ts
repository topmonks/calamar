import { ArchiveConnection } from "../model/archiveConnection";
import { fetchGraphql } from "../utils/fetchGraphql";
import { decodeMetadata } from "../utils/metadata";
import { unifyConnection } from "../utils/unifyConnection";

import { getLatestRuntimeSpec } from "./runtimeService";

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

export async function getEventsByName(
	network: string,
	limit: number,
	offset: number,
	name: string,
	order: EventsOrder = "id_DESC"
) {
	let [pallet, event] = name.split(".");

	// try to fix casing according to latest runtime spec
	const runtimeSpec = await getLatestRuntimeSpec(network);
	const metadata = decodeMetadata(runtimeSpec.hex);

	const runtimePallet = metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeEvents = runtimePallet && metadata.lookup.getSiType(runtimePallet.events.unwrap().type).def.asVariant.variants;
	const runtimeEvent = runtimeEvents?.find(it => it.name.toLowerCase() === event?.toLowerCase());

	pallet = runtimePallet?.name.toString() || pallet;
	event = runtimeEvent?.name.toString() || event;

	let filter;

	if (event) {
		filter = {
			name_eq: `${pallet}.${event}`
		};
	} else {
		filter = {
			name_startsWith: `${pallet}.`
		};
	}

	return getEventsWithoutTotalCount(network, limit, offset, filter, order);
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
	limit: number,
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
			first: limit,
			after,
			filter,
			order,
		}
	);

	return unifyConnection(response?.eventsConnection, limit, offset);
}
