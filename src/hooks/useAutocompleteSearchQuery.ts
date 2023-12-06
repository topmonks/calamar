import { Network } from "../model/network";
import { autocompleteSearchQuery } from "../services/searchService";

import { UseResourceOptions, useResource } from "./useResource";

export function useAutocompleteSearchQuery(
	query: string,
	networks: Network[],
	options?: UseResourceOptions
) {
	return useResource(autocompleteSearchQuery, [query, networks], options);
}
