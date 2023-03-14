import { FetchOptions } from "../model/fetchOptions";
import { BlocksFilter, BlocksOrder, getBlocks } from "../services/blocksService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order?: BlocksOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getBlocks, [network, filter, order], options);
}
