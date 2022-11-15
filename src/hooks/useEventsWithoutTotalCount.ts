import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, EventsOrder, getEventsWithoutTotalCount } from "../services/eventsService";

import { useItems } from "./useItems";

export function useEventsWithoutTotalCount(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return useItems(getEventsWithoutTotalCount, network, filter, order, options);
}
