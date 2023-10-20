export type ItemsResponse<T = any, C extends boolean = false> = {
	data: T[];
	pagination: {
		offset: number;
		limit: number;
		hasNextPage: boolean;
	},
	totalCount?: number;
} & (C extends true ? {
	totalCount: number;
} : object)
