import { getRuntimeMetadataEvents } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataEvents(
	network: string,
	specVersion: string,
	palletName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataEvents, [network, specVersion, palletName], options);
}
