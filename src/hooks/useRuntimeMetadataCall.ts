import { getRuntimeMetadataCall } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataCall(
	network: string,
	specVersion: string,
	palletName: string,
	callName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataCall, [network, specVersion, palletName, callName], options);
}
