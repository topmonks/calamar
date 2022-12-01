import { useCallback, useEffect, useMemo, useState } from "react";
import { useRollbar } from "@rollbar/react";

import { FetchOptions } from "../model/fetchOptions";
import { PaginatedResource } from "../model/paginatedResource";
import { ItemsResponse } from "../model/itemsResponse";
import { GraphQLError } from "../utils/fetchGraphql";

import { usePagination } from "./usePagination";

export function usePaginatedResource<T = any, F = any>(
	fetchItems: (network: string, limit: number, offset: number, filter: F, order?: string|string[]) => ItemsResponse<T>|Promise<ItemsResponse<T>>,
	network: string | undefined,
	filter: F,
	order?: string|string[],
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const [data, setData] = useState<T[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>();

	const pagination = usePagination();

	const fetchData = useCallback(async () => {
		if (!network) {
			// don't do anything until network is set
			return;
		}

		if (!options?.skip) {
			try {
				const items = await fetchItems(
					network,
					pagination.limit,
					pagination.offset,
					filter,
					order
				);

				setData(items.data);
				pagination.set(items.pagination);
			} catch(e) {
				if (e instanceof GraphQLError) {
					rollbar.error(e);
					setError(e);
				} else {
					throw e;
				}
			}
		}

		setLoading(false);
	}, [
		fetchItems,
		network,
		JSON.stringify(filter),
		JSON.stringify(order),
		pagination.limit,
		pagination.offset,
		options?.skip,
	]);

	useEffect(() => {
		setData([]);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() => ({
			data,
			loading,
			notFound: !loading && !error && (!data || data.length === 0),
			pagination,
			error,
			refetch: fetchData
		}) as PaginatedResource,
		[data, loading, pagination, error, fetchData]
	);
}
