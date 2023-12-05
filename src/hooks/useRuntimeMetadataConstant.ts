import { getRuntimeMetadataConstant } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataConstant(
	network: string,
	specVersion: string,
	palletName: string,
	constantName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataConstant, [network, specVersion, palletName, constantName], options);
}
