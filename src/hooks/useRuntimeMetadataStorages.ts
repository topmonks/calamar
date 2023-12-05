import { getRuntimeMetadataStorages } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataStorages(
	network: string,
	specVersion: string,
	palletName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataStorages, [network, specVersion, palletName], options);
}
