import { FetchOptions } from "../model/fetchOptions";
import { getStats, StatsFilter, StatsOrder } from "../services/statsService";
import { useResource } from "./useResource";

export function useStats(
	network: string,
	filter: StatsFilter|undefined,
	order?: StatsOrder|undefined,
	options?: FetchOptions
) {
	return useResource(getStats, [network, filter, order], options);
}
