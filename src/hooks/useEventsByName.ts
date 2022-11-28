import { FetchOptions } from "../model/fetchOptions";
import { EventsOrder, getEventsByName } from "../services/eventsService";

import { useItems } from "./useItems";

export function useEventsByName(
	network: string | undefined,
	name: string,
	order?: EventsOrder,
	options?: FetchOptions
) {
	return useItems(getEventsByName, network, name, order, options);
}
