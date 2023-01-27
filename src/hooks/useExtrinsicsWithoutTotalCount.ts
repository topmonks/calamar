import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsicsWithoutTotalCount } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsicsWithoutTotalCount(
	network: string,
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsicsWithoutTotalCount, [network, filter, order], options);
}
