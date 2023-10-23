import { useRollbar } from "@rollbar/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FetchOptions } from "../model/fetchOptions";
import { Resource } from "../model/resource";
import { DataError } from "../utils/error";

type ResourceProps<T> = Omit<Resource<T>, "notFound" | "refetch">;

const defaultResourceProps = {
	data: undefined,
	loading: true,
	error: undefined,
};

export function useResource<T = any, F extends any[] = any[]>(
	fetchItem: (...args: F) => T|undefined|Promise<T|undefined>,
	args: F,
	options?: FetchOptions
) {
	const rollbar = useRollbar();

	const fetchRequestKey = useMemo(() => JSON.stringify(args), [JSON.stringify(args)]);
	const previousFetchRequestKeyRef = useRef<string>();

	const [resourceProps, setResourceProps] = useState<ResourceProps<T>>(defaultResourceProps);

	const fetchData = useCallback(async () => {
		if (options?.waitUntil) {
			// wait until all required condition are met
			return;
		}

		if (!options?.skip) {
			try {
				const data = await fetchItem(...args);
				setResourceProps((props) => ({
					...props,
					data
				}));
			} catch(error) {
				if (error instanceof DataError) {
					rollbar.error(error);
					setResourceProps((props) => ({
						...props,
						error: error
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
	}, [fetchItem, fetchRequestKey, options?.waitUntil, options?.skip]);

	useEffect(() => {
		setResourceProps((props) => ({
			...props,
			data: undefined,
			error: undefined,
			loading: true
		}));
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		previousFetchRequestKeyRef.current = fetchRequestKey;
	}, [fetchRequestKey]);

	return useMemo<Resource<T>>(
		() => {
			if (previousFetchRequestKeyRef.current && previousFetchRequestKeyRef.current !== fetchRequestKey) {
				// do not return old data if the fetch args changed
				return ({
					...defaultResourceProps,
					notFound: false,
					refetch: fetchData
				});
			}

			return ({
				...resourceProps,
				notFound: !resourceProps.loading && !resourceProps.error && !resourceProps.data,
				refetch: fetchData
			});
		},
		[fetchRequestKey, resourceProps, fetchData]
	);
}
