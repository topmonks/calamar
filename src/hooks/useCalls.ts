import { CallsFilter, getCalls } from "../services/callsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useCalls(
	network: string,
	filter: CallsFilter,
	options?: UsePaginatedResourceOptions,
) {
	return usePaginatedResource(getCalls, [network, filter, options?.order], options);
}
