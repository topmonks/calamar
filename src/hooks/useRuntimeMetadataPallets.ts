import { useCallback } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { getPalletsRuntimeMetadata } from "../services/runtimeMetadataService";

import { useResource } from "./useResource";

export function useRuntimeMetadataPallets(
	network?: string | undefined,
	specVersion?: number | undefined,
	options?: FetchOptions
) {
	return useResource(
		useCallback(async (network?: string, specVersion?: number) => {
			if (network && specVersion) {
				const pallets = await getPalletsRuntimeMetadata(network, specVersion);
				return await pallets.toArray();
			}
		}, []),
		[network, specVersion],
		options
	);
}
