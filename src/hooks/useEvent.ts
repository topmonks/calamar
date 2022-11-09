import { FetchOptions } from "../model/fetchOptions";
import { getEvent } from "../services/eventsService";

import { useItem } from "./useItem";

export function useEvent(
	network: string | undefined,
	id: string,
	options?: FetchOptions
) {
	return useItem(getEvent, network, id, options);
}
