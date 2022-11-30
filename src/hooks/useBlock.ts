import { FetchOptions } from "../model/fetchOptions";
import { BlocksFilter, getBlock } from "../services/blocksService";

import { useResource } from "./useResource";

export function useBlock(
	network: string | undefined,
	filter: BlocksFilter,
	options?: FetchOptions
) {
	return useResource(getBlock, network, filter, options);
}
