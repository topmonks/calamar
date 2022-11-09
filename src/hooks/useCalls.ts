import { FetchOptions } from "../model/fetchOptions";
import { getCalls } from "../services/callsService";
import { EventsFilter, EventsOrder } from "../services/eventsService";

import { useItems } from "./useItems";

export function useCalls(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions,
) {
	return useItems(getCalls, network, filter, order, options);
}
