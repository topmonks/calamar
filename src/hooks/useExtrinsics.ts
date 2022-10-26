import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import {
	ExtrinsicsFilter,
	ExtrinsicsOrder,
	getExtrinsics,
} from "../services/extrinsicsService";

import { usePagination } from "./usePagination";

export function useExtrinsics(
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

		const extrinsics = await getExtrinsics(
			network,
			pagination.limit,
			pagination.offset,
			filter,
			order
		);

		setLoading(false);
		console.warn(extrinsics);

		setItems(extrinsics.edges);
		if (extrinsics.totalCount) pagination.setPagination(
			{
				...pagination,
				hasNext: pagination.offset + pagination.limit < extrinsics.totalCount,
				totalCount: extrinsics.totalCount,
			}
		);
		else pagination.setHasNext(true);
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
