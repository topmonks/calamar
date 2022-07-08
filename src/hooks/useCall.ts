import { useEffect, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { CallsFilter, getCall } from "../services/callsService";

export function useCall(filter: CallsFilter, options?: FetchOptions) {
  const [call, setCall] = useState<any>(null);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getCall(filter);
      setCall(extrinsic);
    };
    fetchData();
  }, [JSON.stringify(filter), options?.skip]);

  return call;
}
