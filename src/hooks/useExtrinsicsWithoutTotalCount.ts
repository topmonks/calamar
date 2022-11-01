import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import {
	ExtrinsicsFilter,
	ExtrinsicsOrder,
	getExtrinsicsWithoutTotalCount,
} from "../services/extrinsicsService";

import { usePagination } from "./usePagination";

export function useExtrinsicsWithoutTotalCount(
	network: string | undefined,
	filter: ExtrinsicsFilter,
	order?: ExtrinsicsOrder,
	options?: FetchOptions
) {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);

	const pagination = usePagination();

	const fetchItems = useCallback(async () => {
		if (!network || options?.skip) {
			return;
		}

		const extrinsics = await getExtrinsicsWithoutTotalCount(
			network,
			pagination.limit,
			pagination.offset,
			filter,
			order
		);
		const nextExtrinsics = await getExtrinsicsWithoutTotalCount(
			network,
			pagination.limit,
			pagination.offset + pagination.limit,
			filter,
			order
		);

		console.log("nextE", nextExtrinsics);

		setLoading(false);
		setItems(extrinsics.items);
		pagination.setHasNext(nextExtrinsics.items.length > 0);
	}, [
		network,
		JSON.stringify(filter),
		JSON.stringify(order),
		pagination.limit,
		pagination.offset,
		options?.skip,
	]);

	useEffect(() => {
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
