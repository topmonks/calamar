import { getTransfers, TransfersFilter, TransfersOrder } from "../services/transfersService";

import { usePaginatedResource, UsePaginatedResourceOptions } from "./usePaginatedResource";

export function useTransfers(
	network: string,
	filter: TransfersFilter | undefined,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getTransfers, [network, filter, options?.order], options);
}
