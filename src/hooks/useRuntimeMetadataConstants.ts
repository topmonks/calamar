import { getRuntimeMetadataConstants } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataConstants(
	network: string,
	specVersion: string,
	palletName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataConstants, [network, specVersion, palletName], options);
}
