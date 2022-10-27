export const unifyConnection = (connection: any) => {
	return {
		...connection,
		items: connection.edges.map((item: any) => item.node)
	};
};