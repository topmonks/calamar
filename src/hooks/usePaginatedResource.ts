import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRollbar } from "@rollbar/react";

import { FetchOptions } from "../model/fetchOptions";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginatedResource } from "../model/paginatedResource";
import { PaginationOptions } from "../model/paginationOptions";
import { DataError } from "../utils/error";

import { usePagination } from "./usePagination";

type PaginatedResourceProps<T> = Omit<PaginatedResource<T>, "notFound" | "pagination" | "refetch">;

const defaultResourceProps = {
	data: [],
	totalCount: undefined,
	loading: true,
	error: undefined,
};

export function usePaginatedResource<T = any, F extends any[] = any[]>(
	fetchItems: (...args: [...F, PaginationOptions]) => ItemsResponse<T>|Promise<ItemsResponse<T>>,
	args: F,
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const fetchRequestKey = useMemo(() => JSON.stringify(args), [JSON.stringify(args)]);
	const previousFetchRequestKeyRef = useRef<string>();

	const [resourceProps, setResourceProps] = useState<PaginatedResourceProps<T>>(defaultResourceProps);

	const pagination = usePagination();

	const fetchData = useCallback(async () => {
		if (options?.waitUntil) {
			// wait until all required condition are met
			return;
		}

		if (!options?.skip) {
			try {
				const items = await fetchItems(...args, {
					limit: pagination.limit,
					offset: pagination.offset,
				});

				setResourceProps((props) => ({
					...props,
					data: items.data,
					totalCount: items.totalCount
				}));

				pagination.set(items.pagination);
			} catch(error) {
				if (error instanceof DataError) {
					rollbar.error(error);
					setResourceProps((props) => ({
						...props,
						error
					}));
				} else {
					throw error;
				}
			}
		}

		setResourceProps((props) => ({
			...props,
			loading: false
		}));
	}, [
		fetchItems,
		fetchRequestKey,
		pagination.limit,
		pagination.offset,
		options?.skip,
	]);

	useEffect(() => {
		setResourceProps((props) => ({
			...props,
			data: [],
			error: undefined,
			loading: true
		}));
		fetchData();
	}, [fetchData]);

	return useMemo<PaginatedResource<T>>(
		() => {
			if (previousFetchRequestKeyRef.current && previousFetchRequestKeyRef.current !== fetchRequestKey) {
				// do not return old data if the fetch args changed
				return ({
					...defaultResourceProps,
					notFound: false,
					pagination,
					refetch: fetchData
				});
			}

			return ({
				...resourceProps,
				notFound: !resourceProps.loading && !resourceProps.error && (!resourceProps.data || resourceProps.data.length === 0),
				pagination,
				refetch: fetchData
			});
		},
		[fetchRequestKey, resourceProps, pagination, fetchData]
	);
}
