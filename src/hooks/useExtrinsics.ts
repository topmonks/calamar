import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import {
  ExtrinsicsFilter,
  ExtrinsicsOrder,
  getExtrinsics,
} from "../services/extrinsicsService";

import { usePagination } from "./usePagination";

export function useExtrinsics(
  filter: ExtrinsicsFilter,
  order?: ExtrinsicsOrder,
  options?: FetchOptions
) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  const pagination = usePagination();

  const fetchItems = useCallback(async () => {
    if (options?.skip) {
      return;
    }

    const extrinsics = await getExtrinsics(
      pagination.limit,
      pagination.offset,
      filter,
      order
    );
    const nextExtrinsics = await getExtrinsics(
      pagination.limit,
      pagination.offset + pagination.limit,
      filter,
      order
    );

    console.log("nextE", nextExtrinsics);

    setLoading(false);
    setItems(extrinsics);
    pagination.setHasNext(nextExtrinsics.length > 0);
  }, [
    JSON.stringify(filter),
    JSON.stringify(order),
    pagination.limit,
    pagination.offset,
    options?.skip,
  ]);

  useEffect(() => {
    setLoading(true);
    fetchItems();

    if (pagination.offset === 0) {
      const interval = setInterval(() => {
        fetchItems();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [fetchItems, pagination.offset]);

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
