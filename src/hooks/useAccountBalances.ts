import { getAccountBalances } from "../services/balancesService";

import { UseResourceOptions, useResource } from "./useResource";

export function useAccountBalances(
	address: string,
	options?: UseResourceOptions,
) {
	return useResource(getAccountBalances, [address], options);
}
