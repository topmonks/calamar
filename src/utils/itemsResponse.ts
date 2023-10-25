import { ItemsResponse } from "../model/itemsResponse";

export function emptyResponse(): ItemsResponse<never> {
	return {
		data: [],
		pageInfo: {
			page: 1,
			pageSize: 10, // TODO constant
			hasNextPage: false,
		},
		totalCount: 0,
	};
}
