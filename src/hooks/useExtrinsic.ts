import { useEffect, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { ExtrinsicsFilter, getExtrinsic } from "../services/extrinsicsService";

export function useExtrinsic(filter: ExtrinsicsFilter, options?: FetchOptions) {
  const [extrinsic, setExtrinsic] = useState<any>(null);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getExtrinsic(filter);
      setExtrinsic(extrinsic);
    };
    fetchData();
  }, [JSON.stringify(filter), options?.skip]);

  return extrinsic;
}
