import { useMemo } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginatedResource } from "../model/paginatedResource";
import { PaginationOptions } from "../model/paginationOptions";

import { usePagination } from "./usePagination";
import { useResource } from "./useResource";

export function usePaginatedResource<T = any, F extends any[] = any[]>(
	fetchItems: (...args: [...F, PaginationOptions]) => ItemsResponse<T>|Promise<ItemsResponse<T>>,
	args: F,
	options: FetchOptions = {}
) {
	const pagination = usePagination();

	const resource = useResource(fetchItems, [...args, {
		limit: pagination.limit,
		offset: pagination.offset
	}], {
		...options,
		onSuccess: (data) => {
			data && pagination.set(data.pagination);
		}
	});

	return useMemo<PaginatedResource<T>>(() => ({
		data: resource.data?.data,
		totalCount: resource.data?.totalCount,
		loading: resource.loading,
		notFound: resource.notFound || resource.data?.data.length === 0,
		error: resource.error,
		pagination,
	}), [resource, pagination]);
}
