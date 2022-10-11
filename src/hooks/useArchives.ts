import { getArchives } from "../services/archiveRegistryService";

export function useArchives() {
	return getArchives();
}
