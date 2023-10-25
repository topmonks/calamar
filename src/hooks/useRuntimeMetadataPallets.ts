import { useCallback } from "react";

import { getPalletsRuntimeMetadata } from "../services/runtimeMetadataService";

import { UseResourceOptions, useResource } from "./useResource";

export function useRuntimeMetadataPallets(
	network?: string | undefined,
	specVersion?: number | undefined,
	options?: UseResourceOptions
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
