export type ItemsResponse<T = any> = {
	data: T[];
	pagination: {
		offset: number;
		limit: number;
		hasNextPage: boolean;
		totalCount?: number;
	}
}
