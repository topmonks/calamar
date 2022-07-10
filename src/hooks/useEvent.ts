import { useCallback, useEffect, useMemo, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { EventsFilter, getEvent } from "../services/eventsService";

export function useEvent(filter: EventsFilter, options?: FetchOptions) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    if (options?.skip) {
      return;
    }

    const extrinsic = await getEvent(filter);
    setLoading(false);
    setEvent(extrinsic);
  }, [JSON.stringify(filter), options?.skip]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return useMemo(
    () => [event, { loading, refetch: fetchData }] as const,
    [event, loading, fetchData]
  );
}
