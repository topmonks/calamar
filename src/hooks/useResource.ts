import { useEffect, useMemo } from "react";
import useSwr, { SWRConfiguration } from "swr";
import { useRollbar } from "@rollbar/react";

import { Resource } from "../model/resource";
import { DataError } from "../utils/error";

export interface UseResourceOptions extends SWRConfiguration {
	/**
	 * Use this if the data are not needed based on some condition.
	 *
	 * Behaves like normal except the data fetch is not actually
	 * performed and results with "Not found".
	 */
	skip?: boolean;

	/**
	 * Refetch data in regular interval specified by `refreshInterval` (default 3000ms)
	 */
	refresh?: boolean;
}

export function useResource<T = any, F extends any[] = any[]>(
	fetchItem: (...args: F) => T|undefined|Promise<T|undefined>,
	args: F,
	options: UseResourceOptions = {}
) {
	const rollbar = useRollbar();

	const {skip, refresh, refreshInterval = 3000, ...swrOptions} = options;

	const swrKey = !skip
		? [fetchItem, args]
		: null;

	const {data, isLoading, error, mutate} = useSwr(swrKey, swrFetcher, {
		...swrOptions,
		refreshInterval: refresh ? refreshInterval : undefined,
	});

	useEffect(() => {
		if (!error) {
			return;
		}

		if (error && error instanceof DataError) {
			rollbar.error(error);
		} else {
			throw error;
		}
	}, [error]);

	return useMemo<Resource<T>>(() => ({
		data,
		loading: isLoading,
		error,
		notFound: !isLoading && !error && !data,
		refetch: mutate
	}), [data, isLoading, error]);
}

/*** PRIVATE ***/

type DataFetcher<T, F extends any[]> = (...args: F) => T|undefined|Promise<T|undefined>;

function swrFetcher<T = any, F extends any[] = any[]>(
	[fetchItem, args]: [DataFetcher<T, F>, F],
) {
	return fetchItem(...args);
}
