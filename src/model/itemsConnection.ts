export type ItemsConnection<T = any> = {
	edges: {
		node: T
	}[],
	pageInfo: {
		startCursor: string;
		endCursor: string;
		hasPreviousPage: boolean;
		hasNextPage: boolean;
	},
	totalCount: number;
}
