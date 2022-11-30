import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, EventsOrder, getEvents } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useEvents(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getEvents, network, filter, order, options);
}
