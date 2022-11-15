import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, EventsOrder, getEvents } from "../services/eventsService";

import { useItems } from "./useItems";

export function useEvents(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return useItems(getEvents, network, filter, order, options);
}
