import { FetchOptions } from "../model/fetchOptions";
import { CallsFilter, getCall } from "../services/callsService";

import { useItem } from "./useItem";

export function useCall(
	network: string | undefined,
	filter: CallsFilter,
	options?: FetchOptions
) {
	return useItem(getCall, network, filter, options);
}
