import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, EventsOrder, getEventsWithoutTotalCount } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useEventsWithoutTotalCount(
	network: string,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getEventsWithoutTotalCount, [network, filter, order], options);
}
