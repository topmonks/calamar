import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsicsWithoutTotalCount } from "../services/extrinsicsService";

import { useItems } from "./useItems";

export function useExtrinsicsWithoutTotalCount(
	network: string | undefined,
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return useItems(getExtrinsicsWithoutTotalCount, network, filter, order, options);
}
