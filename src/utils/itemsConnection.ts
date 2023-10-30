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
	transformNode: (node: T, ...a: A) => R|Promise<R>,
	...additionalArgs: A
): Promise<ItemsResponse<R, C>> {
	const data = [];

	for (const edge of connection.edges) {
		data.push(await transformNode(edge.node, ...additionalArgs));
	}

	const startIndex = parseInt(connection.pageInfo.startCursor || "1") - 1;
	const endIndex = parseInt(connection.pageInfo.endCursor || "1"); // non-inclusive

	const pageSize = (endIndex - startIndex);
	const page = Math.floor(startIndex / pageSize) + 1;

	const totalPageCount = connection.totalCount
		? Math.ceil(connection.totalCount / pageSize)
		: undefined;

	return {
		data,
		pageInfo: {
			page,
			pageSize,
			hasNextPage: connection.pageInfo.hasNextPage,
			totalPageCount
		},
		totalCount: connection.totalCount
	} as ItemsResponse<R, C>;
}
