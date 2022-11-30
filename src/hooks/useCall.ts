import { FetchOptions } from "../model/fetchOptions";
import { CallsFilter, getCall } from "../services/callsService";

import { useResource } from "./useResource";

export function useCall(
	network: string | undefined,
	filter: CallsFilter,
	options?: FetchOptions
) {
	return useResource(getCall, network, filter, options);
}
