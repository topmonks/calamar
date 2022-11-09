import { FetchOptions } from "../model/fetchOptions";
import { BlocksFilter, getBlock } from "../services/blocksService";

import { useItem } from "./useItem";

export function useBlock(
	network: string | undefined,
	filter: BlocksFilter,
	options?: FetchOptions
) {
	return useItem(getBlock, network, filter, options);
}
