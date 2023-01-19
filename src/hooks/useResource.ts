import { useRollbar } from "@rollbar/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { Resource } from "../model/resource";
import { GraphQLError } from "../utils/fetchGraphql";

export function useResource<T = any, F = any>(
	fetchItem: (network: string, filter: F) => T|undefined|Promise<T|undefined>,
	network: string | undefined,
	filter: F,
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>();

	const fetchData = useCallback(async () => {
		if (!network || options?.waitUntil) {
			// wait until all required condition are met
			return;
		}

		if (!options?.skip) {
			try {
				const data = await fetchItem(network, filter);
				setData(data);
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
	}, [fetchItem, network, JSON.stringify(filter), options?.waitUntil, options?.skip]);

	useEffect(() => {
		setData(undefined);
		setError(undefined);
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() => ({
			data,
			loading,
			notFound: !loading && !error && !data,
			error,
			refetch: fetchData
		}) as Resource<T>,
		[data, loading, error, fetchData]
	);
}
