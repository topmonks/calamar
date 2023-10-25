import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

import { UseResourceOptions, useResource } from "./useResource";

export function useExtrinsic(
	network: string,
	filter: ExtrinsicsFilter,
	options?: UseResourceOptions
) {
	return useResource(getExtrinsic, [network, filter], options);
}
