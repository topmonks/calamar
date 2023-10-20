import { ItemsConnection } from "../model/itemsConnection";
import { ItemsResponse } from "../model/itemsResponse";
import { PaginationOptions } from "../model/paginationOptions";

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

	return {
		data,
		pagination: {
			...pagination,
			hasNextPage: connection.pageInfo.hasNextPage,
		},
		totalCount: connection.totalCount
	} as ItemsResponse<R, C>;
}
