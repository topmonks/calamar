import { useEffect, useState } from "react";
import { FetchOptions } from "../model/fetchOptions";

import { BlocksFilter, getBlock } from "../services/blocksService";

export function useBlock(filter: BlocksFilter, options?: FetchOptions) {
  const [block, setBlock] = useState<any>(null);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getBlock(filter);
      setBlock(extrinsic);
    };
    fetchData();
  }, [JSON.stringify(filter), options?.skip]);

  return block;
}
