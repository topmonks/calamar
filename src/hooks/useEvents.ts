import { useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { EventsFilter, getEvents } from "../services/eventsService";

import { usePagination } from "./usePagination";

export function useEvents(filter: EventsFilter, options?: FetchOptions) {
  const [items, setItems] = useState([]);

  const pagination = usePagination();

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchItems = async (limit: number, offset: number) => {
      const extrinsics = await getEvents(limit, offset, filter);
      const nextExtrinsics = await getEvents(limit, offset + limit, filter);

      setItems(extrinsics);
      pagination.setHasNext(nextExtrinsics.length > 0);
    };

    fetchItems(pagination.limit, pagination.offset);

    const interval = setInterval(async () => {
      await fetchItems(pagination.limit, pagination.offset);
    }, 10000);

    return () => clearInterval(interval);
  }, [JSON.stringify(filter), options?.skip, pagination, setItems]);

  return useMemo(
    () => ({
      items,
      pagination,
    }),
    [items, pagination]
  );
}
