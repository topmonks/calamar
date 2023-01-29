import { useMemo } from "react";

import { getNetwork } from "../services/networksService";

export function useNetwork(name: string) {
	return useMemo(() => getNetwork(name), [name]);
}
