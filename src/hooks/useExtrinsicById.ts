import { useEffect, useState } from "react";

import { getExtrinsicById } from "../services/extrinsicsService";

export function useExtrinsicById(id: string | undefined) {
  const [extrinsic, setExtrinsic] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchData = async () => {
      const extrinsic = await getExtrinsicById(id);
      setExtrinsic(extrinsic);
    };
    fetchData();
  }, [id]);

  return extrinsic;
}
