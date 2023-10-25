import { Network } from "../model/network";
import { search } from "../services/searchService";

import { UseResourceOptions, useResource } from "./useResource";

export function useSearch(
	query: string,
	networks?: Network[],
	options?: UseResourceOptions
) {
	return useResource(search, [query, networks], options);
}
