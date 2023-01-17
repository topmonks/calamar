import { FetchOptions } from "../model/fetchOptions";
import { getCallerArchive } from "../services/archiveRegistryService";
import { getCallsByAccount } from "../services/callsService";
import { ExtrinsicsOrder } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountCalls(
	network: string,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	const filter = {
		callerPublicKey_eq: address,
	};
	if (getCallerArchive(network)){
		return usePaginatedResource(getCallsByAccount, network, filter, order, options);
	}
	
	return undefined;
}