import { getRuntimeSpecVersions } from "../services/runtimeSpecService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeSpecVersions(
	network: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeSpecVersions, [network], options);
}
