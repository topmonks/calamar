import { getNetworks } from "../services/archiveRegistryService";

export function useNetworks() {
	return getNetworks();
}
