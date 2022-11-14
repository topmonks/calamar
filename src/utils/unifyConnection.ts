import { ArchiveConnection } from "../model/archiveConnection";
import { ItemsResponse } from "../model/itemsResponse";

export function unifyConnection<T = any>(connection: ArchiveConnection<T>, limit: number, offset: number): ItemsResponse<T> {
	return {
		data: connection.edges.map((edge) => edge.node),
		pagination: {
			offset,
			limit,
			hasNextPage: connection.pageInfo.hasNextPage,
			totalCount: connection.totalCount
		}
	};
}
