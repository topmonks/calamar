import { useRollbar } from "@rollbar/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { GraphQLError } from "../utils/fetchGraphql";

export function useItem<T = any, F = any>(
	fetchItem: (network: string, filter: F) => T|Promise<T>,
	network: string | undefined,
	filter: F,
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const [data, setData] = useState<T>();
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<any>();

	const fetchData = useCallback(async () => {
		if (!network) {
			// don't do anything until network is set
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
	}, [fetchItem, network, JSON.stringify(filter), options?.skip]);

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
			refetch: fetchData,
			notFound: !loading && !error && !data,
			error
		}),
		[data, loading, error, fetchData]
	);
}
