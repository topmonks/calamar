import { FetchOptions } from "../model/fetchOptions";
import { getCallsByAccount } from "../services/callsService";
import { ExtrinsicsOrder } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountCalls(
	network: string | undefined,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	const filter = {
		callerPublicKey_eq: address,
	};
	return usePaginatedResource(getCallsByAccount, network, filter, order, options);
}