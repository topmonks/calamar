import { Network } from "../model/network";
import { search } from "../services/searchService";

import { UseResourceOptions, useResource } from "./useResource";

interface UseSearchOptions extends UseResourceOptions {
	page?: number;
}

export function useSearch(
	query: string,
	networks: Network[],
	options: UseSearchOptions = {}
) {
	const { page = 1 } = options;

	return useResource(search, [query, networks, {
		page,
		pageSize: 10 // TODO constant
	}], options);
}
