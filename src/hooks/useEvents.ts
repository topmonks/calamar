import { EventsFilter, EventsOrder, getEvents } from "../services/eventsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useEvents(
	network: string,
	filter: EventsFilter,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getEvents, [network, filter, options?.order], options);
}
