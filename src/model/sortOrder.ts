import { SortDirection } from "./sortDirection";

export type SortOrder<T> = {
	property: T|undefined;
	direction: SortDirection;
}
