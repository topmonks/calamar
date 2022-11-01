import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { getEvent } from "../services/eventsService";

export function useEvent(
	network: string | undefined,
	id: string,
	options?: FetchOptions
) {
	const [event, setEvent] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetchData = useCallback(async () => {
		if (!network || options?.skip) {
			return;
		}

		const event = await getEvent(network, id);
		setLoading(false);
		setEvent(event);
	}, [network, id, options?.skip]);

	useEffect(() => {
		setLoading(true);
		fetchData();
	}, [fetchData]);

	return useMemo(
		() => [event, { loading, refetch: fetchData }] as const,
		[event, loading, fetchData]
	);
}
