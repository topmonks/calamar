import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

import { useResource } from "./useResource";

export function useExtrinsic(
	network: string | undefined,
	filter: ExtrinsicsFilter,
	options?: FetchOptions
) {
	return useResource(getExtrinsic, network, filter, options);
}
