import { FetchOptions } from "../model/fetchOptions";
import { BlocksFilter, getBlocks } from "../services/blocksService";
import { ExtrinsicsOrder } from "../services/extrinsicsService";

import { usePaginatedResource } from "./usePaginatedResource";

export function useBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	return usePaginatedResource(getBlocks, [network, filter, order], options);
}
