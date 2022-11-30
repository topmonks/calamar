import { FetchOptions } from "../model/fetchOptions";
import { getRuntimeSpec } from "../services/runtimeService";
import { useItem } from "./useItem";

export function useRuntimeSpec(
	network: string | undefined,
	specVersion: number,
	options?: FetchOptions
) {
	return useItem(getRuntimeSpec, network, specVersion, options);
}
