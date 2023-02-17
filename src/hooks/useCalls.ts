import { FetchOptions } from "../model/fetchOptions";
import { CallsFilter, CallsOrder, getCalls } from "../services/callsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useCalls(
	network: string,
	filter: CallsFilter,
	order?: CallsOrder,
	options?: FetchOptions,
) {
	return usePaginatedResource(getCalls, [network, filter, order], options);
}
