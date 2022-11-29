import { useMemo } from "react";

import { getNetwork } from "../services/archiveRegistryService";

export function useNetwork(name: string) {
	return useMemo(() => getNetwork(name), [name]);
}
