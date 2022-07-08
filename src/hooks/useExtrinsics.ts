import { useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { Order } from "../model/order";
import { ExtrinsicsFilter, getExtrinsics } from "../services/extrinsicsService";

import { usePagination } from "./usePagination";

export function useExtrinsics(
  filter: ExtrinsicsFilter,
  order?: Order,
  options?: FetchOptions
) {
  const [items, setItems] = useState([]);

  const pagination = usePagination();

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchItems = async (limit: number, offset: number) => {
      const extrinsics = await getExtrinsics(limit, offset, filter, order);
      const nextExtrinsics = await getExtrinsics(
        limit,
        offset + limit,
        filter,
        order
      );

      console.log("nextE", nextExtrinsics);

      setItems(extrinsics);
      pagination.setHasNext(nextExtrinsics.length > 0);
    };

    fetchItems(pagination.limit, pagination.offset);

    const interval = setInterval(async () => {
      await fetchItems(pagination.limit, pagination.offset);
    }, 10000);

    return () => clearInterval(interval);
  }, [
    JSON.stringify(filter),
    JSON.stringify(order),
    options?.skip,
    pagination,
    setItems,
  ]);

  return useMemo(
    () => ({
      items,
      pagination,
    }),
    [items, pagination]
  );
}
