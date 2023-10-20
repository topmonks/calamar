export function emptyResponse() {
	return {
		data: [],
		pagination: {
			offset: 0,
			limit: 0,
			hasNextPage: false,
		},
		totalCount: 0,
	};
}
