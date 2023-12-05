import { getRuntimeMetadataEvent } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataEvent(
	network: string,
	specVersion: string,
	palletName: string,
	eventName: string,
	options?: UseResourceOptions
) {
	return useResource(getRuntimeMetadataEvent, [network, specVersion, palletName, eventName], options);
}
