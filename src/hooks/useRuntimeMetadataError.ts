import { getRuntimeMetadataError } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataError(
	network: string,
	specVersion: string,
	palletName: string,
	errorName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataError, [network, specVersion, palletName, errorName], options);
}
