import { FetchOptions } from "../model/fetchOptions";
import { EventsFilter, getEvent } from "../services/eventsService";

import { useItem } from "./useItem";

export function useEvent(
	network: string | undefined,
	filter: EventsFilter,
	options?: FetchOptions
) {
	return useItem(getEvent, network, filter, options);
}
