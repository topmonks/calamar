import archivesJSON from "../archives.json";
import { Archive } from "../model/archive";

export function getArchives() {
  return archivesJSON.archives as Archive[];
}

export function getArchive(network: string) {
  return getArchives().find((archive) => archive.network === network);
}
