import { FetchOptions } from "../model/fetchOptions";
import { getCallerArchive } from "../services/archiveRegistryService";
import { ExtrinsicsOrder, getExtrinsics, getExtrinsicsByAccount } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountExtrinsics(
	network: string,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	const callerFilter = {
		signerPublicKey_eq: address,
	};

	if (getCallerArchive(network)){
		return usePaginatedResource(getExtrinsicsByAccount, network, callerFilter, order, options);
	}



	const archiveFilter = {
		OR: [
			{ signature_jsonContains: `{"address": "${address}" }` },
			{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
		],
	};
	return usePaginatedResource(getExtrinsics, network, archiveFilter, order, options);
}