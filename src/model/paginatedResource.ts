import { PageInfo } from "./pageInfo";
import { Resource } from "./resource";

export type PaginatedResource<T = any> = Resource<T[]> & {
	pageInfo?: PageInfo,
	totalCount?: number;
}
