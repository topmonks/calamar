import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeSpecVersions } from "../services/runtimeService";
import { useResource } from "./useResource";

export function useRuntimeSpecVersions(
	network: string,
	options?: FetchOptions
) {
	return useResource(getRuntimeSpecVersions, [network], options);
}
