import { PageInfo } from "./pageInfo";

export type ItemsResponse<T = any, C extends boolean = false> = {
	data: T[];
	pageInfo: PageInfo;
	totalCount?: number;
} & (C extends true ? {
	totalCount: number;
} : object)
