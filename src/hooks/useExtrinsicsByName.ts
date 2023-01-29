import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsOrder, getExtrinsicsByName } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsicsByName(
	network: string,
	name: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsicsByName, [network, name, order], options);
}
