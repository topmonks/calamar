import { ItemsResponse } from "../model/itemsResponse";

export function emptyItemsResponse(totalCount: number): ItemsResponse<never, true>
export function emptyItemsResponse(totalCount?: undefined): ItemsResponse<never, false>
export function emptyItemsResponse(totalCount?: number): ItemsResponse<never> {
	return {
		data: [],
		pageInfo: {
			page: 1,
			pageSize: 10, // TODO constant
			hasNextPage: false,
			totalPageCount: 0
		},
		totalCount,
	};
}
