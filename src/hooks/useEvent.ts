import { useEffect, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { EventsFilter, getEvent } from "../services/eventsService";

export function useEvent(filter: EventsFilter, options?: FetchOptions) {
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getEvent(filter);
      setEvent(extrinsic);
    };
    fetchData();
  }, [JSON.stringify(filter), options?.skip]);

  return event;
}
