export type PageInfo = {
	page: number;
	pageSize: number;
	totalPageCount: number|undefined;
	hasPrevious: boolean;
	hasNext: boolean;
}
