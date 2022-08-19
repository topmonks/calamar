import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

export function useExtrinsic(
  network: string | undefined,
  filter: ExtrinsicsFilter,
  options?: FetchOptions
) {
  const [extrinsic, setExtrinsic] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!network || options?.skip) {
      return;
    }

    const extrinsic = await getExtrinsic(network, filter);
    setLoading(false);
    setExtrinsic(extrinsic);
  }, [network, JSON.stringify(filter), options?.skip]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => [extrinsic, { loading, refetch: fetchData }] as const,
    [extrinsic, loading, fetchData]
  );
}
