import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";
import { getCallsForExtrinsic } from "../services/callsService";
import { usePagination } from "./usePagination";

export function useCallsForExtrinsic(
	network: string | undefined,
	extrinsicId: string,
	options?: FetchOptions
) {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const pagination = usePagination();

	const fetchItems = useCallback(async () => {
		if (!network || options?.skip) {
			return;
		}

		const calls = await getCallsForExtrinsic(network, extrinsicId);

		const nextExtrinsics = [];

		setLoading(false);
		setItems(calls);
		pagination.setHasNext(nextExtrinsics.length > 0);
	}, [
		network,
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