import { getLatestRuntimeSpecVersion } from "../services/runtimeSpecService";

import { UseResourceOptions, useResource } from "./useResource";

export function useLatestRuntimeSpecVersion(
	network: string,
	options?: UseResourceOptions
) {
	return useResource(getLatestRuntimeSpecVersion, [network], options);
}
