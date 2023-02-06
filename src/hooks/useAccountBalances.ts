import { FetchOptions } from "../model/fetchOptions";
import { getBalances } from "../services/balancesService";

import { useResource } from "./useResource";

export function useAccountBalances(
	address: string,
	options?: FetchOptions,
) {
	return useResource(getBalances, [address], options);
}
