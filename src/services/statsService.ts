import { TAOSTATS_DATA_ENDPOINT } from "../config";
import { Stats } from "../model/stats";

export async function getStats() {
	const res = await fetch(TAOSTATS_DATA_ENDPOINT);
	const data = await res.json();

	console.log(data);

	return data as Stats;
}