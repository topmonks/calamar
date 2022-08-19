import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { BlocksFilter, getBlock } from "../services/blocksService";

export function useBlock(
  network: string | undefined,
  filter: BlocksFilter,
  options?: FetchOptions
) {
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!network || options?.skip) {
      return;
    }

    const block = await getBlock(network, filter);
    setLoading(false);
    setBlock(block);
  }, [network, JSON.stringify(filter), options?.skip]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => [block, { loading, refetch: fetchData }] as const,
    [block, loading, fetchData]
  );
}
