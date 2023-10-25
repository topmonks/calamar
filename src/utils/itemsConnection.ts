import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

export function paginationToConnectionCursor(pagination: PaginationOptions) {
	const offset = (pagination.page - 1) * pagination.pageSize;

	return {
		after: offset === 0 ? null : offset.toString(),
		first: pagination.pageSize
	};
}

export async function extractConnectionItems<R = any, T = any, A extends any[] = any[], C extends boolean = false>(
	connection: ItemsConnection<T, C>,
	transformNode: (node: T, ...a: A) => R|Promise<R>,
	...additionalArgs: A
): Promise<ItemsResponse<R, C>> {
	const data = [];

	for (const edge of connection.edges) {
		data.push(await transformNode(edge.node, ...additionalArgs));
	}

	const startIndex = parseInt(connection.pageInfo.startCursor) - 1;
	const endIndex = parseInt(connection.pageInfo.endCursor); // non-inclusive

	const pageSize = (endIndex - startIndex);
	const page = Math.floor(startIndex / pageSize) + 1;

	return {
		data,
		pageInfo: {
			page,
			pageSize,
			hasNextPage: connection.pageInfo.hasNextPage,
		},
		totalCount: connection.totalCount
	} as ItemsResponse<R, C>;
}
