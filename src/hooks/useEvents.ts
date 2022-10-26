import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import {
	EventsFilter,
	EventsOrder,
	getEvents,
} from "../services/eventsService";

import { usePagination } from "./usePagination";

export function useEvents(
	network: string | undefined,
	filter: EventsFilter,
	order?: EventsOrder,
	options?: FetchOptions
) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);

	const pagination = usePagination();

	const fetchItems = useCallback(async () => {
		if (!network || options?.skip) {
			return;
		}

		const events = await getEvents(
			network,
			pagination.limit,
			pagination.offset,
			filter,
			order
		);

		setLoading(false);
		setItems(events.edges);
		console.warn(events.totalCount);

		pagination.setPagination(
			{
				...pagination,
				hasNext: pagination.offset + pagination.limit < events.totalCount,
				totalCount: events.totalCount,
			}
		);
	}, [
		network,
		JSON.stringify(filter),
		JSON.stringify(order),
		pagination.limit,
		pagination.offset,
		options?.skip,
	]);

	useEffect(() => {
		console.log("tatata");
		setLoading(true);
		fetchItems();
	}, [fetchItems]);

	return useMemo(
		() => ({
			items,
			loading,
			refetch: fetchItems,
			pagination,
		}),
		[items, loading, fetchItems, pagination]
	);
}
