import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

import { useItem } from "./useItem";

export function useExtrinsic(
	network: string | undefined,
	filter: ExtrinsicsFilter,
	options?: FetchOptions
) {
	return useItem(getExtrinsic, network, filter, options);
}
