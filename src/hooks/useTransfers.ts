import { FetchOptions } from "../model/fetchOptions";
import { getTransfers, TransfersFilter, TransfersOrder } from "../services/transfersService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useTransfers(
	network: string,
	filter: TransfersFilter,
	order?: TransfersOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getTransfers, [network, filter, order], options);
}
