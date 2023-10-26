import { Network } from "./network";

export type SearchResultItem<T> = {
	network: Network;
	data?: T;
	groupedCount?: number;
	// TODO error;
}
