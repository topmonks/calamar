export type ItemsConnection<T = any, C extends boolean = false> = {
	edges: {
		node: T
	}[],
	pageInfo: {
		startCursor: string;
		endCursor: string;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	}
	totalCount?: number;
} & (C extends true ? {
	totalCount: number;
} : object)
