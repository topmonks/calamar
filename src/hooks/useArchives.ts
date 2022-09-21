import { getArchives } from "../services/archivesService";

export function useArchives() {
	return getArchives();
}
