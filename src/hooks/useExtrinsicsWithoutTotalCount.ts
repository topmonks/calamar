import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsicsWithoutTotalCount(
	network: string,
	filter: ExtrinsicsFilter|undefined,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getExtrinsics, [network, filter, options?.order, false], options);
}
