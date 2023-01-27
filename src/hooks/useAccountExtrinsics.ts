import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsOrder, getExtrinsicsByAccount } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountExtrinsics(
	network: string,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getExtrinsicsByAccount, [network, address, order], options);
}
