import { getRuntimeMetadataCalls } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataCalls(
	network: string,
	specVersion: string,
	palletName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataCalls, [network, specVersion, palletName], options);
}
