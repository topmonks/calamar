import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, ExtrinsicsOrder, getExtrinsics } from "../services/extrinsicsService";

import { useItems } from "./useItems";

export function useExtrinsics(
	network: string | undefined,
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return useItems(getExtrinsics, network, filter, order, options);
}
