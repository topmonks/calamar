import { Pagination } from "../hooks/usePagination";

import { Resource } from "./resource";

export type PaginatedResource<T = any> = Resource<T[]> & {
	pagination: Pagination
	totalCount?: number;
}
