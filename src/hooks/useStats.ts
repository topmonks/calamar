import { getStats } from "../services/statsService";
import { useResource } from "./useResource";

export function useStats() {
	return useResource(getStats, []);
}