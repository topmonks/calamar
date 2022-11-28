import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeSpecVersions } from "../services/runtimeService";
import { useItem } from "./useItem";

export function useRuntimeSpec(
	network: string | undefined,
	options?: FetchOptions
) {
	return useItem(getRuntimeSpecVersions, network, options);
}
