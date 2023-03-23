import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

export function extractConnectionItems<R = any, T = any, A extends any[] = any[]>(
	connection: ItemsConnection<T>,
	pagination: PaginationOptions,
	transformNode: (node: T, ...a: A) => R,
	...additionalArgs: A
): ItemsResponse<R> {
	return {
		data: connection.edges.map((edge) => transformNode(edge.node, ...additionalArgs)),
		pagination: {
			...pagination,
			hasNextPage: connection.pageInfo.hasNextPage,
			totalCount: connection.totalCount
		}
	};
}
