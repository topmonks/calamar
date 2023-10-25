import { EventsOrder, getEventsByName } from "../services/eventsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useEventsByName(
	network: string,
	name: string,
	order?: EventsOrder,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getEventsByName, [network, name, order], options);
}
