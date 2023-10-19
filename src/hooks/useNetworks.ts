import { getNetworks } from "../services/networksService";

export function useNetworks(names?: string[]) {
	return getNetworks(names);
}
