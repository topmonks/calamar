import { Network } from "./network";

export type SearchResultItem<T> = {
	id: string;
	network: Network;
	data?: T;
	groupedCount?: number;
	// TODO error;
}
