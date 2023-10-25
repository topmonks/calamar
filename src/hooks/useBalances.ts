import { BalancesFilter, getBalances } from "../services/balancesService";
import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useBalances(
	network: string,
	filter: BalancesFilter | undefined,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getBalances, [network, filter, options?.order], options);
}
