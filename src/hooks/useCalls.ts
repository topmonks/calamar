import { FetchOptions } from "../model/fetchOptions";
import { getCalls } from "../services/callsService";
import { EventsFilter, EventsOrder } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useCalls(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions,
) {
	return usePaginatedResource(getCalls, network, filter, order, options);
}
