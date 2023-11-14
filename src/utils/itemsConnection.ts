import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

export function paginationToConnectionCursor(pagination: PaginationOptions) {
	const offset = (pagination.page - 1) * pagination.pageSize;

	const first = pagination.pageSize;
	const after = offset === 0 ? null : offset.toString();

	return {
		first,
		after
	};
}

export async function extractConnectionItems<R = any, T = any, A extends any[] = any[], C extends boolean = false>(
	connection: ItemsConnection<T, C>,
	pagination: PaginationOptions,
	transformNode: (node: T, ...a: A) => R|Promise<R>,
	...additionalArgs: A
): Promise<ItemsResponse<R, C>> {
	const data = [];

	for (const edge of connection.edges) {
		data.push(await transformNode(edge.node, ...additionalArgs));
	}

	const totalPageCount = connection.totalCount
		? Math.ceil(connection.totalCount / pagination.pageSize)
		: undefined;

	return {
		data,
		pageInfo: {
			page: pagination.page,
			pageSize: pagination.pageSize,
			totalPageCount,
			hasPrevious: connection.pageInfo.hasNextPage,
			hasNext: connection.pageInfo.hasNextPage,
		},
		totalCount: connection.totalCount
	} as ItemsResponse<R, C>;
}
