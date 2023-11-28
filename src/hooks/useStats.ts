import { getStats, StatsFilter, StatsOrder } from "../services/statsService";

import { useResource, UseResourceOptions } from "./useResource";

export function useStats(
	network: string,
	filter: StatsFilter|undefined,
	order?: StatsOrder|undefined,
	options?: UseResourceOptions
) {
	return useResource(getStats, [network, filter, order], options);
}
