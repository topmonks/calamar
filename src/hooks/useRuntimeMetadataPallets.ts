import { getRuntimeMetadataPallets } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataPallets(
	network: string,
	specVersion: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataPallets, [network, specVersion], options);
}
