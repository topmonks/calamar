import { ArchiveEvent } from "../model/archive/archiveEvent";
import { ExplorerSquidEvent } from "../model/explorer-squid/explorerSquidEvent";

import { Event } from "../model/event";
import { ItemsConnection } from "../model/itemsConnection";
import { ItemsCounter } from "../model/itemsCounter";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

import { addItemMetadata, addItemsMetadata } from "../utils/addMetadata";
import { extractConnectionItems } from "../utils/extractConnectionItems";
import { lowerFirst, upperFirst } from "../utils/string";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { hasSupport } from "./networksService";
import { getEventsRuntimeMetadata, getPalletsRuntimeMetadata, getRuntimeEventMetadata } from "./runtimeMetadataService";
import { getLatestRuntimeSpecVersion } from "./runtimeSpecService";

export type EventsFilter =
	{ id_eq: string; }
	| { blockId_eq: string; }
	| { callId_eq: string; }
	| { extrinsicId_eq: string; }
	| { palletName_eq: string; }
	| { palletName_eq: string, eventName_eq: string; };

export type EventsOrder = string | string[];

export async function getEvent(network: string, filter: EventsFilter) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidEvent(network, filter);
	}

	return getArchiveEvent(network, filter);
}

export async function getEventsByName(
	network: string,
	name: string,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
): Promise<ItemsResponse<Event>> {
	const {palletName, eventName} = await normalizeEventName(network, name);

	const filter: EventsFilter = eventName
		? { palletName_eq: palletName, eventName_eq: eventName }
		: { palletName_eq: palletName };


	if (hasSupport(network, "explorer-squid")) {
		const counterFilter = eventName
			? `Events.${palletName}.${eventName}`
			: `Events.${palletName}`;

		// this call is divided on purpose, otherwise it would timeout when there are no events found.
		const countResponse = await fetchExplorerSquid<{itemsCounterById: ItemsCounter|null}>(
			network,
			`query ($counterFilter: String!) {
				itemsCounterById(id: $counterFilter) {
					total
				}
			}`,
			{
				counterFilter,
			}
		);

		if (countResponse.itemsCounterById === null || countResponse.itemsCounterById.total === 0) {
			return {
				data: [],
				pagination: {
					...pagination,
					hasNextPage: false
				}
			};
		}

		const events = await getExplorerSquidEvents(network, filter, order, pagination, false);
		events.pagination.totalCount = countResponse.itemsCounterById.total;

		return events;
	}

	return getArchiveEvents(network, filter, order, pagination, false);
}

export async function getEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	if (hasSupport(network, "explorer-squid")){
		return getExplorerSquidEvents(network, filter, order, pagination);
	}

	return getArchiveEvents(network, filter, order, pagination);
}

export async function normalizeEventName(network: string, name: string) {
	let [palletName = "", eventName = ""] = name.toLowerCase().split(".");

	const latestRuntimeSpecVersion = await getLatestRuntimeSpecVersion(network);

	const pallets = await getPalletsRuntimeMetadata(network, latestRuntimeSpecVersion);
	const pallet = await pallets.and(it => it.name.toLowerCase() === palletName).first();

	const events = pallet && await getEventsRuntimeMetadata(network, latestRuntimeSpecVersion, pallet.name);
	const event = await events?.and(it => it.name.toLowerCase() === eventName).first();

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	palletName = pallet?.name || upperFirst(palletName);
	eventName = event?.name || upperFirst(eventName);

	return {
		palletName,
		eventName
	};
}

/*** PRIVATE ***/

async function getArchiveEvent(network: string, filter: EventsFilter) {
	const response = await fetchArchive<{events: ArchiveEvent[]}>(
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
			filter: eventsFilterToArchiveFilter(filter),
		}
	);

	const data = response.events[0] && unifyArchiveEvent(response.events[0], network);
	const event = addItemMetadata(data, getEventMetadata);

	return event;
}

async function getExplorerSquidEvent(network: string, filter: EventsFilter) {
	const response = await fetchExplorerSquid<{events: ExplorerSquidEvent[]}>(
		network,
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				id
				eventName
				palletName
				block {
					id
					height
					timestamp
					specVersion
				}
				extrinsic {
					id
				}
				call {
					id
				}
			}
		}`,
		{
			filter: eventsFilterToExplorerSquidFilter(filter),
		}
	);

	const data = response.events[0] && unifyExplorerSquidEvent(response.events[0], network);
	const dataWithMetadata = await addItemMetadata(data, getEventMetadata);
	const event = await addEventArgs(network, dataWithMetadata);

	return event;
}

async function getArchiveEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchArchive<{eventsConnection: ItemsConnection<ArchiveEvent>}>(
		network,
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
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
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: eventsFilterToArchiveFilter(filter),
			order,
		}
	);

	const items = extractConnectionItems(response.eventsConnection, pagination, unifyArchiveEvent, network);
	const events = await addItemsMetadata(items, getEventMetadata);

	return events;
}

async function getExplorerSquidEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	const response = await fetchExplorerSquid<{eventsConnection: ItemsConnection<ExplorerSquidEvent>}>(
		network,
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
			eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
				edges {
					node {
						id
						eventName
						palletName
						block {
							id
							height
							timestamp
							specVersion
						}
						extrinsic {
							id
						}
						call {
							id
						}
					}
				}
				pageInfo {
					endCursor
					hasNextPage
					hasPreviousPage
					startCursor
				}
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first: pagination.limit,
			after,
			filter: eventsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const data = extractConnectionItems(response.eventsConnection, pagination, unifyExplorerSquidEvent, network);
	const dataWithMetadata = await addItemsMetadata(data, getEventMetadata);
	const events = await addEventsArgs(network, dataWithMetadata);

	return events;
}

async function getArchiveEventArgs(network: string, eventIds: string[]) {
	const response = await fetchArchive<{events: {id: string, args: any}[]}>(
		network,
		`
			query($ids: [String!]) {
				events(where: { id_in: $ids }) {
					id
					args
				}
			}
		`,
		{
			ids: eventIds,
		}
	);

	return response.events.reduce((argsByEventId, event) => {
		argsByEventId[event.id] = event.args;
		return argsByEventId;
	}, {} as Record<string, any>);
}

async function addEventArgs(network: string, event: Event|undefined) {
	if (!event) {
		return undefined;
	}

	const argsByEventId = await getArchiveEventArgs(network, [event.id]);

	return {
		...event,
		args: argsByEventId[event.id]
	};
}

async function addEventsArgs(network: string, items: ItemsResponse<Event>) {
	const eventIds = items.data.map((event) => event.id);

	const argsByEventId = await getArchiveEventArgs(network, eventIds);

	return {
		...items,
		data: items.data.map(event => ({
			...event,
			args: argsByEventId[event.id]
		}))
	};
}

function unifyArchiveEvent(event: ArchiveEvent, network: string): Omit<Event, "metadata"> {
	const [palletName, eventName] = event.name.split(".") as [string, string];

	return {
		...event,
		network,
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		palletName,
		eventName,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		args: null,
		specVersion: event.block.spec.specVersion,
	};
}

function unifyExplorerSquidEvent(event: ExplorerSquidEvent, network: string): Omit<Event, "metadata"> {
	return {
		...event,
		network,
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		args: null,
		specVersion: event.block.specVersion,
	};
}

async function getEventMetadata(event: Omit<Event, "metadata">): Promise<Event["metadata"]> {
	return {
		event: await getRuntimeEventMetadata(event.network, event.specVersion, event.palletName, event.eventName)
	};
}

function eventsFilterToArchiveFilter(filter?: EventsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("callId_eq" in filter) {
		return {
			call: {
				id_eq: filter.callId_eq
			}
		};
	} else if ("extrinsicId_eq" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId_eq
			}
		};
	} else if ("palletName_eq" in filter) {
		return {
			name_eq: ("eventName_eq" in filter)
				? `${filter.palletName_eq}.${filter.eventName_eq}`
				: filter.palletName_eq
		};
	}

	return filter;
}

function eventsFilterToExplorerSquidFilter(filter?: EventsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("blockId_eq" in filter) {
		return {
			block: {
				id_eq: filter.blockId_eq
			}
		};
	} else if ("callId_eq" in filter) {
		return {
			call: {
				id_eq: filter.callId_eq
			}
		};
	} else if ("extrinsicId_eq" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId_eq
			}
		};
	}

	return filter;
}
