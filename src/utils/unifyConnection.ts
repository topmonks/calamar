import { ArchiveConnection } from "../model/archiveConnection";
import { ItemsResponse } from "../model/itemsResponse";

export function unifyConnection<T = any>(connection: ArchiveConnection<T>): ItemsResponse<T> {
	const offset = parseInt(connection.pageInfo.startCursor) - 1;

	return {
		data: connection.edges.map((edge) => edge.node),
		pagination: {
			offset,
			limit: parseInt(connection.pageInfo.endCursor) - offset,
			hasNextPage: connection.pageInfo.hasNextPage,
			totalCount: connection.totalCount
		}
	};
}
