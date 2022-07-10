import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

export function useExtrinsic(filter: ExtrinsicsFilter, options?: FetchOptions) {
  const [extrinsic, setExtrinsic] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (options?.skip) {
      return;
    }

    const extrinsic = await getExtrinsic(filter);
    setLoading(false);
    setExtrinsic(extrinsic);
  }, [JSON.stringify(filter), options?.skip]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => [extrinsic, { loading, refetch: fetchData }] as const,
    [extrinsic, loading, fetchData]
  );
}
