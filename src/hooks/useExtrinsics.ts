import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsics(
	network: string,
	filter: ExtrinsicsFilter,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getExtrinsics, [network, filter, options?.order, true], options);
}
