import { FetchOptions } from "../model/fetchOptions";
import { getCallsByAccount } from "../services/callsService";
import { ExtrinsicsOrder } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountCalls(
	network: string,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getCallsByAccount, network, address, order, options);
}