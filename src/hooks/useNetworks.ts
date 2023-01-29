import { getNetworks } from "../services/networksService";

export function useNetworks() {
	return getNetworks();
}
