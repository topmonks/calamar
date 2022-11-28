import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsOrder, getExtrinsicsByName } from "../services/extrinsicsService";

import { useItems } from "./useItems";

export function useExtrinsicsByName(
	network: string | undefined,
	name: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return useItems(getExtrinsicsByName, network, name, order, options);
}
