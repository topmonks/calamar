import { FetchOptions } from "../model/fetchOptions";
import { EventsOrder, getEventsByName } from "../services/eventsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useEventsByName(
	network: string,
	name: string,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getEventsByName, [network, name, order], options);
}
