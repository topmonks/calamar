import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { CallsFilter, getCall } from "../services/callsService";

export function useCall(
	network: string | undefined,
	filter: CallsFilter,
	options?: FetchOptions
) {
	const [call, setCall] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchData = useCallback(async () => {
		if (!network || options?.skip) {
			return;
		}

		const call = await getCall(network, filter);
		setLoading(false);
		setCall(call);
	}, [network, JSON.stringify(filter), options?.skip]);

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() => [call, { loading, refetch: fetchData }] as const,
		[call, loading, fetchData]
	);
}
