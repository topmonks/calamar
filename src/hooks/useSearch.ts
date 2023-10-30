import { Account } from "../model/account";
import { Block } from "../model/block";
import { Event } from "../model/event";
import { Extrinsic } from "../model/extrinsic";
import { ItemsResponse } from "../model/itemsResponse";
import { Network } from "../model/network";
import { PaginatedResource } from "../model/paginatedResource";
import { Resource } from "../model/resource";
import { SearchResultItem } from "../model/searchResultItem";
import { SearchResult } from "../model/searchResult";

import { SearchPaginationOptions, search } from "../services/searchService";

import { PickByType } from "../utils/types";

import { UseResourceOptions, useResource } from "./useResource";

interface UseSearchOptions extends UseResourceOptions {
	pagination?: SearchPaginationOptions;
}

export function useSearch(
	query: string,
	networks: Network[],
	options: UseSearchOptions = {}
) {
	const { pagination } = options;

	console.log("search pagination", pagination);

	const defaultPagination = {
		page: 1,
		pageSize: 10 // TODO constant
	};

	const resource = useResource(search, [query, networks, {
		accounts: pagination?.accounts || defaultPagination,
		blocks: pagination?.blocks || defaultPagination,
		extrinsics: pagination?.extrinsics || defaultPagination,
		events: pagination?.events || defaultPagination
	}], options);

	return {
		...resource,
		accounts: searchResultItemsToPaginatedResource<Account>(resource, "accounts"),
		blocks: searchResultItemsToPaginatedResource<Block>(resource, "blocks"),
		extrinsics: searchResultItemsToPaginatedResource<Extrinsic>(resource, "extrinsics"),
		events: searchResultItemsToPaginatedResource<Event>(resource, "events"),
		totalCount: resource.data?.totalCount
	};
}

function searchResultItemsToPaginatedResource<T>(
	resource: Resource<SearchResult>,
	itemsType: keyof PickByType<SearchResult, ItemsResponse<SearchResultItem<T>, true>>,
): PaginatedResource<SearchResultItem<T>> {
	const items = resource.data?.[itemsType];

	return {
		data: items?.data as SearchResultItem<T>[] | undefined,
		pageInfo: items?.pageInfo,
		totalCount: items?.totalCount,
		loading: resource.loading,
		notFound: resource.notFound || items?.data.length === 0,
		error: undefined, // TODO
		refetch: resource.refetch
	};
}
