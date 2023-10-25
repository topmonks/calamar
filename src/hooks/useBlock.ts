import { BlocksFilter, getBlock } from "../services/blocksService";

import { UseResourceOptions, useResource } from "./useResource";

export function useBlock(
	network: string,
	filter: BlocksFilter,
	options?: UseResourceOptions
) {
	return useResource(getBlock, [network, filter], options);
}
