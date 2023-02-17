import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

export function extractConnectionItems<R = any, T = any>(
	connection: ItemsConnection<T>,
	pagination: PaginationOptions,
	transformNode: (node: T) => R
): ItemsResponse<R> {
	return {
		data: connection.edges.map((edge) => transformNode(edge.node)),
		pagination: {
			...pagination,
			hasNextPage: connection.pageInfo.hasNextPage,
			totalCount: connection.totalCount
		}
	};
}
