export type ArchiveConnection<T = any> = {
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
