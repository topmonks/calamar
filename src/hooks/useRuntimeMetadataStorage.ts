import { getRuntimeMetadataStorage } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataStorage(
	network: string,
	specVersion: string,
	palletName: string,
	storageName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataStorage, [network, specVersion, palletName, storageName], options);
}
