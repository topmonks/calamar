import { getRuntimeMetadataErrors } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataErrors(
	network: string,
	specVersion: string,
	palletName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataErrors, [network, specVersion, palletName], options);
}
