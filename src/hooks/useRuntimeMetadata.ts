import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeMetadata } from "../services/runtimeMetadataService";

import { useResource } from "./useResource";

export function useRuntimeMetadata(
	network: string,
	specVersion: number | undefined,
	options?: FetchOptions
) {
	return useResource(getRuntimeMetadata, [network, specVersion], options);
}
