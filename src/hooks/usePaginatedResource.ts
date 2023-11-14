import { useMemo } from "react";

import { ItemsResponse } from "../model/itemsResponse";
import { PaginatedResource } from "../model/paginatedResource";
import { PaginationOptions } from "../model/paginationOptions";

import { UseResourceOptions, useResource } from "./useResource";

export interface UsePaginatedResourceOptions<O = string> extends UseResourceOptions {
	order?: O;
	page?: number;
	refreshFirstPage?: boolean;
}

export function usePaginatedResource<T = any, F extends any[] = any[]>(
	fetchItems: (...args: [...F, PaginationOptions]) => ItemsResponse<T>|Promise<ItemsResponse<T>>,
	args: F,
	options: UsePaginatedResourceOptions = {}
) {
	const {page = 1, refresh, refreshFirstPage, ...restOptions} = options;

	const resource = useResource(fetchItems, [...args, { page, pageSize: 10 /* TODO constant */ }], {
		...restOptions,
		revalidateOnFocus: false,
		refresh: refresh || (refreshFirstPage && page === 1)
	});

	return useMemo<PaginatedResource<T>>(() => ({
		data: resource.data?.data,
		totalCount: resource.data?.totalCount,
		loading: resource.loading,
		notFound: resource.notFound || resource.data?.data.length === 0,
		error: resource.error,
		pageInfo: resource.data?.pageInfo,
		refetch: resource.refetch
	}), [resource]);
}
