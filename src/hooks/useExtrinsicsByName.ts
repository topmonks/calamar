import { ExtrinsicsOrder, getExtrinsicsByName } from "../services/extrinsicsService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useExtrinsicsByName(
	network: string,
	name: string,
	order?: ExtrinsicsOrder,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getExtrinsicsByName, [network, name, order], options);
}
