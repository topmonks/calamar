import { ArchiveEntry } from "@subsquid/archive-registry";
import archivesJson from "@subsquid/archive-registry/archives.json";

export function getArchives() {
  return archivesJson.archives as ArchiveEntry[];
}

export function getArchive(network: string) {
  return getArchives().find((archive) => archive.network === network);
}
