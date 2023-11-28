import { BlocksFilter, getBlocks } from "../services/blocksService";

import { UsePaginatedResourceOptions, usePaginatedResource } from "./usePaginatedResource";

export function useBlocks(
	network: string,
	filter: BlocksFilter | undefined,
	options?: UsePaginatedResourceOptions
) {
	return usePaginatedResource(getBlocks, [network, filter, options?.order], options);
}
