import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, getEvent } from "../services/eventsService";

import { useResource } from "./useResource";

export function useEvent(
	network: string,
	filter: EventsFilter,
	options?: FetchOptions
) {
	return useResource(getEvent, [network, filter], options);
}
