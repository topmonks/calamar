import { FetchOptions } from "../model/fetchOptions";
import { getAccountBalances } from "../services/balancesService";

import { useResource } from "./useResource";

export function useAccountBalances(
	address: string,
	options?: FetchOptions,
) {
	return useResource(getAccountBalances, [address], options);
}
