import { useEffect, useMemo } from "react";
import useSwr from "swr";
import { useRollbar } from "@rollbar/react";

import { FetchOptions } from "../model/fetchOptions";
import { Resource } from "../model/resource";
import { DataError } from "../utils/error";

export function useResource<T = any, F extends any[] = any[]>(
	fetchItem: (...args: F) => T|undefined|Promise<T|undefined>,
	args: F,
	options: FetchOptions = {}
) {
	const rollbar = useRollbar();

	const {skip, ...swrOptions} = options;

	const swrKey = !skip
		? [fetchItem, args]
		: null;

	const {data, isLoading, error} = useSwr(swrKey, swrFetcher, swrOptions);

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
	}), [data, isLoading, error]);
}

/*** PRIVATE ***/

type DataFetcher<T, F extends any[]> = (...args: F) => T|undefined|Promise<T|undefined>;

function swrFetcher<T = any, F extends any[] = any[]>(
	[fetchItem, args]: [DataFetcher<T, F>, F],
) {
	return fetchItem(...args);
}
