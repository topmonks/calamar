import { ArchiveEvent } from "../model/archive/archiveEvent";
import { ExplorerSquidEvent } from "../model/explorer-squid/explorerSquidEvent";

import { Event } from "../model/event";
import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

import { simplifyId } from "../utils/id";
import { extractConnectionItems, paginationToConnectionCursor } from "../utils/itemsConnection";
import { upperFirst } from "../utils/string";

import { fetchArchive, fetchExplorerSquid, registerItemFragment, registerItemsConnectionFragment } from "./fetchService";
import { getNetwork, hasSupport } from "./networksService";
import { getEventsRuntimeMetadata, getPalletsRuntimeMetadata, getRuntimeEventMetadata } from "./runtimeMetadataService";
import { getLatestRuntimeSpecVersion } from "./runtimeSpecService";

export type EventsFilter =
	undefined
	| { simplifiedId: string; }
	| { blockId: string; }
	| { callId: string; }
	| { extrinsicId: string; }
	| { palletName: string; }
	| { palletName: string, eventName: string; };

export type EventsOrder = string | string[];

export async function getEvent(network: string, filter: EventsFilter) {
	if (hasSupport(network, "explorer-squid")) {
		return getExplorerSquidEvent(network, filter);
	}

	return getArchiveEvent(network, filter);
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
		pallet: palletName,
		event: eventName
	};
}

/*** PRIVATE ***/

registerItemFragment("ArchiveEvent", "Event", `
	id
	name
	indexInBlock
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
`);

registerItemFragment("ExplorerSquidEvent", "Event", `
	id
	eventName
	palletName
	indexInBlock
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
`);

registerItemsConnectionFragment("ArchiveEventsConnection", "EventsConnection", "...ArchiveEvent");
registerItemsConnectionFragment("ExplorerSquidEventsConnection", "EventsConnection", "...ExplorerSquidEvent");

async function getArchiveEvent(network: string, filter: EventsFilter) {
	const response = await fetchArchive<{events: ArchiveEvent[]}>(
		network,
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				...ArchiveEvent
			}
		}`,
		{
			filter: eventsFilterToArchiveFilter(filter),
		}
	);

	return response.events[0] && unifyArchiveEvent(response.events[0], network);
}

async function getExplorerSquidEvent(network: string, filter: EventsFilter) {
	const response = await fetchExplorerSquid<{events: ExplorerSquidEvent[]}>(
		network,
		`query ($filter: EventWhereInput) {
			events(limit: 1, offset: 0, where: $filter, orderBy: id_DESC) {
				...ExplorerSquidEvent
			}
		}`,
		{
			filter: eventsFilterToExplorerSquidFilter(filter),
		}
	);

	const data = response.events[0] && await unifyExplorerSquidEvent(response.events[0], network);
	const event = await addEventArgs(network, data);

	return event;
}

async function getArchiveEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchArchive<{eventsConnection: ItemsConnection<ArchiveEvent>}>(
		network,
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
			eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
				...ArchiveEventsConnection
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first,
			after,
			filter: eventsFilterToArchiveFilter(filter),
			order,
		}
	);

	return extractConnectionItems(
		response.eventsConnection,
		pagination,
		unifyArchiveEvent,
		network
	);
}

async function getExplorerSquidEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions,
	fetchTotalCount = true
) {
	const {first, after} = paginationToConnectionCursor(pagination);

	const response = await fetchExplorerSquid<{eventsConnection: ItemsConnection<ExplorerSquidEvent>}>(
		network,
		`query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
			eventsConnection(orderBy: $order, where: $filter, first: $first, after: $after) {
				...ExplorerSquidEventsConnection
				${fetchTotalCount ? "totalCount" : ""}
			}
		}`,
		{
			first,
			after,
			filter: eventsFilterToExplorerSquidFilter(filter),
			order,
		}
	);

	const data = await extractConnectionItems(
		response.eventsConnection,
		pagination,
		unifyExplorerSquidEvent,
		network
	);

	const events = await addEventsArgs(network, data);

	return events;
}

async function getArchiveEventArgs(network: string, eventIds: string[]) {
	const response = await fetchArchive<{events: {id: string, args: any}[]}>(
		network,
		`query($ids: [String!]) {
			events(where: { id_in: $ids }) {
				id
				args
			}
		}`,
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

export async function addEventsArgs<C extends boolean = false>(network: string, items: ItemsResponse<Event, C>) {
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


/**
 * Get simplified version of extrinsic ID
 * which will be displayed to the user.
 *
 * It doesn't include block hash and parts have no leading zeros.
 *
 * examples:
 * - 0020537612-000041-5800a -> 20537612-41
 */
export function simplifyEventId(id: string) {
	return simplifyId(id, /\d{10}-\d{6}-[^-]{5}/, 2);
}

export async function unifyArchiveEvent(event: ArchiveEvent, network: string): Promise<Event> {
	const [palletName, eventName] = event.name.split(".") as [string, string];
	const specVersion = event.block.spec.specVersion;

	return {
		...event,
		network: getNetwork(network),
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		palletName,
		eventName,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		specVersion,
		metadata: {
			event: await getRuntimeEventMetadata(network, specVersion, palletName, eventName)
		}
	};
}

export async function unifyExplorerSquidEvent(event: ExplorerSquidEvent, network: string): Promise<Event> {
	const {palletName, eventName} = event;
	const specVersion = event.block.specVersion;

	return {
		...event,
		network: getNetwork(network),
		blockId: event.block.id,
		blockHeight: event.block.height,
		timestamp: event.block.timestamp,
		extrinsicId: event.extrinsic?.id || null,
		callId: event.call?.id || null,
		args: null,
		specVersion,
		metadata: {
			event: await getRuntimeEventMetadata(network, specVersion, palletName, eventName)
		}
	};
}

export function eventsFilterToArchiveFilter(filter?: EventsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		const [blockHeight = "", indexInBlock = ""] = filter.simplifiedId.split("-");

		return {
			block: {
				height_eq: parseInt(blockHeight),
			},
			indexInBlock_eq: parseInt(indexInBlock)
		};
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("callId" in filter) {
		return {
			call: {
				id_eq: filter.callId
			}
		};
	}

	if ("extrinsicId" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId
			}
		};
	}

	if ("palletName" in filter) {
		return {
			name_eq: ("eventName" in filter)
				? `${filter.palletName}.${filter.eventName}`
				: filter.palletName
		};
	}
}

export function eventsFilterToExplorerSquidFilter(filter?: EventsFilter) {
	if (!filter) {
		return undefined;
	}

	if ("simplifiedId" in filter) {
		const [blockHeight = "", indexInBlock = ""] = filter.simplifiedId.split("-");

		return {
			blockNumber_eq: parseInt(blockHeight),
			indexInBlock_eq: parseInt(indexInBlock)
		};
	}

	if ("blockId" in filter) {
		return {
			block: {
				id_eq: filter.blockId
			}
		};
	}

	if ("callId" in filter) {
		return {
			call: {
				id_eq: filter.callId
			}
		};
	}

	if ("extrinsicId" in filter) {
		return {
			extrinsic: {
				id_eq: filter.extrinsicId
			}
		};
	}

	if ("palletName" in filter) {
		return "eventName" in filter
			? {
				palletName_eq: filter.palletName,
				eventName_eq: filter.eventName
			}
			: {
				palletName_eq: filter.palletName
			};
	}
}
