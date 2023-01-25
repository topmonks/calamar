import { ArchiveConnection } from "../model/archiveConnection";
import { Event } from "../model/event";

import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";

import { fetchArchive } from "./fetchService";
import { getRuntimeSpec } from "./runtimeService";

export type EventsFilter = any;
export type EventsOrder = string | string[];

export async function getEvent(network: string, filter: EventsFilter) {
	const response = await fetchArchive<{events: Omit<Event, "runtimeSpec">[]}>(
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

	return addRuntimeSpec(
		network,
		response.events[0],
		it => it.block.spec.specVersion
	);
}

export async function getEventsByName(
	network: string,
	limit: number,
	offset: number,
	name: string,
	order: EventsOrder = "id_DESC"
) {
	let [pallet = "", event = ""] = name.split(".");

	// try to fix casing according to latest runtime spec
	const latestRuntimeSpec = await getRuntimeSpec(network, "latest");

	const runtimePallet = latestRuntimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeEvent = runtimePallet?.events.find(it => it.name.toLowerCase() === event.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	pallet = runtimePallet?.name.toString() || upperFirst(pallet);
	event = runtimeEvent?.name.toString() || upperFirst(event);

	const filter = {
		name_eq: `${pallet}.${event}`
	};

	return getEventsWithoutTotalCount(network, limit, offset, filter, order);
}

export async function getEventsWithoutTotalCount(
	network: string,
	limit: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const response = await fetchArchive<{events: Omit<Event, "runtimeSpec">[]}>(
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

	return addRuntimeSpecs(
		network,
		{
			data: items,
			pagination: {
				offset,
				limit,
				hasNextPage
			}
		},
		it => it.block.spec.specVersion
	);
}

export async function getEvents(
	network: string,
	limit: number,
	offset: number,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC"
) {
	const after = offset === 0 ? null : offset.toString();

	const response = await fetchArchive<{eventsConnection: ArchiveConnection<Omit<Event, "runtimeSpec">>}>(
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

	return addRuntimeSpecs(
		network,
		unifyConnection(response?.eventsConnection, limit, offset),
		it => it.block.spec.specVersion
	);
}
