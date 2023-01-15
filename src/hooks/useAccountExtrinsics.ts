import { FetchOptions } from "../model/fetchOptions";
import { ExtrinsicsOrder, getExtrinsicsByAccount } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useAccountExtrinsics(
	network: string | undefined,
	address: string,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	const filter = {
		signerPublicKey_eq: address,
	};
	return usePaginatedResource(getExtrinsicsByAccount, network, filter, order, options);
}