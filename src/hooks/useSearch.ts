import { FetchOptions } from "../model/fetchOptions";
import { Network } from "../model/network";
import { search } from "../services/searchService";

import { useResource } from "./useResource";

export function useSearch(
	query: string,
	networks?: Network[],
	options?: FetchOptions
) {
	return useResource(search, [query, networks], options);
}
