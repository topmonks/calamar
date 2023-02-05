import { ArchiveConnection } from "../model/archiveConnection";
import { upperFirst } from "../utils/string";
import { unifyConnection } from "../utils/unifyConnection";
import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { getRuntimeSpec } from "./runtimeService";
import { getExplorerSquid } from "./networksService";
import { PaginationOptions } from "../model/paginationOptions";
import { addRuntimeSpec, addRuntimeSpecs } from "../utils/addRuntimeSpec";
import { Event } from "../model/event";
import { ItemsCounter } from "../model/itemsCounter";

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
	name: string,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	let [pallet = "", event = ""] = name.split(".");

	const runtimeSpec = await getRuntimeSpec(network, "latest");

	// try to fix casing according to latest runtime spec
	const runtimePallet = runtimeSpec.metadata.pallets.find(it => it.name.toLowerCase() === pallet.toLowerCase());
	const runtimeEvent = runtimePallet?.events.find(it => it.name.toLowerCase() === event.toLowerCase());

	// use found names from runtime metadata or try to fix the first letter casing as fallback
	pallet = runtimePallet?.name.toString() || upperFirst(pallet);
	event = runtimeEvent?.name.toString() || upperFirst(event);

	if (getExplorerSquid(network)) {
		const after = pagination.offset === 0 ? null : pagination.offset.toString();

		
		const filter = event !== "undefined" ? {
			palletName_eq: pallet,
			eventName_eq: event,
		} : {
			palletName_eq: pallet,
		};
		
		const counterFilter = event !== "undefined" ? `Events.${pallet}.${event}` : `Events.${pallet}`;

		const countResponse = await fetchExplorerSquid<{itemsCounterById: ItemsCounter}>(
			network,
			`
			query ($counterFilter: String!) {
				itemsCounterById(id: $counterFilter) {
					total
				}
			}
		`,
			{
				counterFilter,
			}
		);

		if (countResponse.itemsCounterById === null || countResponse.itemsCounterById.total === null) {
			return addRuntimeSpecs(
				network,
				unifyConnection(
					{
						edges:[],
						pageInfo: {
							endCursor: "",
							hasNextPage: false,
							hasPreviousPage: false,
							startCursor: ""
						},
						totalCount: 0,
					},
					pagination.limit,
					pagination.offset
				),
				it => it.block.spec.specVersion
			);
		}

		const response = await fetchExplorerSquid<{eventsConnection: ArchiveConnection<any>}>(
			network,
			`
			query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
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
				}
			}
		`,
			{
				first: pagination.limit,
				after,
				filter,
				order,
			}
		);

		// if the items exist, return them
		const eventIds = response.eventsConnection.edges.map((item) => item.node.id);

		const args = await fetchArchive(
			network,
			`
				query($ids: [String!]) {
					events(where: { id_in: $ids }) {
						args
					}
				}
			`,
			{
				ids: eventIds,
			}
		);
		

		// unify the response
		const data = {
			...response.eventsConnection,
			totalCount: countResponse.itemsCounterById.total,
			edges: response.eventsConnection.edges.map((item, index) => {
				const itemData = {
					node: {
						...item.node,
						args: args.events[index].args,
						name: item.node.palletName.concat(".", item.node.eventName),
						block: {
							...item.node.block,
							spec: {
								specVersion: item.node.block.specVersion,
							}
						}
					}
				};
				return itemData;
			}),
		};

		return addRuntimeSpecs(
			network,
			unifyConnection(
				data,
				pagination.limit,
				pagination.offset
			),
			it => it.block.spec.specVersion
		);
		

		// empty response
		
	}

	// the old search
	const filter = {
		name_eq: `${pallet}.${event}`
	};

	return getEventsWithoutTotalCount(network, filter, order, pagination);
}

export async function getEventsWithoutTotalCount(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const response = await fetchArchive<{events: any[]}>(
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
			limit: pagination.limit + 1, // get one item more to test if next page exists
			offset: pagination.offset,
			filter,
			order,
		}
	);

	const items = response.events;
	const hasNextPage = items.length > pagination.limit;

	if (hasNextPage) {
		// remove testing item from next pages
		items.pop();
	}

	return addRuntimeSpecs(
		network,
		{
			data: items,
			pagination: {
				...pagination,
				hasNextPage
			}
		},
		it => it.block.spec.specVersion
	);
}

export async function getEvents(
	network: string,
	filter: EventsFilter,
	order: EventsOrder = "id_DESC",
	pagination: PaginationOptions
) {
	const after = pagination.offset === 0 ? null : pagination.offset.toString();

	if (getExplorerSquid(network)){

		const response = await fetchExplorerSquid<{eventsConnection: ArchiveConnection<any>}>(
			network,
			`
			query ($first: Int!, $after: String, $filter: EventWhereInput, $order: [EventOrderByInput!]!) {
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
					totalCount
				}
			}
		`,
			{
				first: pagination.limit,
				after,
				filter,
				order,
			}
		);

		const eventIds = response.eventsConnection.edges.map((item) => item.node.id);

		const args = await fetchArchive(
			network,
			`
				query($ids: [String!]) {
					events(where: { id_in: $ids }) {
						args
					}
				}
			`,
			{
				ids: eventIds,
			}
		);
		

		// unify the response
		const data = {
			...response.eventsConnection,
			edges: response.eventsConnection.edges.map((item, index) => {
				const itemData = {
					node: {
						...item.node,
						args: args.events[index].args,
						name: item.node.palletName.concat(".", item.node.eventName),
						block: {
							...item.node.block,
							spec: {
								specVersion: item.node.block.specVersion,
							}
						}
					}
				};
				return itemData;
			}),
		};

		return addRuntimeSpecs(
			network,
			unifyConnection(
				data,
				pagination.limit,
				pagination.offset
			),
			it => it.block.spec.specVersion
		);
	}

	const response = await fetchArchive<{eventsConnection: ArchiveConnection<any>}>(
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
			first: pagination.limit,
			after,
			filter,
			order,
		}
	);

	return addRuntimeSpecs(
		network,
		unifyConnection(
			response?.eventsConnection,
			pagination.limit,
			pagination.offset
		),
		it => it.block.spec.specVersion
	);
}
