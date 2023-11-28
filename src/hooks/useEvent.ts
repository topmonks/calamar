import { EventsFilter, getEvent } from "../services/eventsService";

import { UseResourceOptions, useResource } from "./useResource";

export function useEvent(
	network: string,
	filter: EventsFilter,
	options?: UseResourceOptions
) {
	return useResource(getEvent, [network, filter], options);
}
