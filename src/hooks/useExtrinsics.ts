import { useEffect, useState } from "react";

import { Order } from "../model/order";
import { ExtrinsicsFilter, getExtrinsics } from "../services/extrinsicsService";

import { usePagination } from "./usePagination";

export function useExtrinsics(filter: ExtrinsicsFilter = {}, order?: Order) {
  const [extrinsics, setExtrinsics] = useState([]);

  const pagination = usePagination();

  useEffect(() => {
    const getExtrinsicsAndSetState = async (limit: number, offset: number) => {
      const extrinsics = await getExtrinsics(limit, offset, filter, order);
      const nextExtrinsics = await getExtrinsics(
        limit,
        offset + limit,
        filter,
        order
      );

      console.log("nextE", nextExtrinsics);

      setExtrinsics(extrinsics);
      pagination.setHasNext(nextExtrinsics.length > 0);
    };

    getExtrinsicsAndSetState(pagination.limit, pagination.offset);

    const interval = setInterval(async () => {
      await getExtrinsicsAndSetState(pagination.limit, pagination.offset);
    }, 10000);

    return () => clearInterval(interval);
  }, [filter, order, pagination, setExtrinsics]);

  return [extrinsics, pagination] as const;
}
