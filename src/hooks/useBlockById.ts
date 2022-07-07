import { useEffect, useState } from "react";

import { getBlockById } from "../services/blocksService";

export function useBlockById(id: string | undefined) {
  const [block, setBlock] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getBlockById(id);
      setBlock(extrinsic);
    };
    fetchData();
  }, [id]);

  return block;
}
