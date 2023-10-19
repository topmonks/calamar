export type Resource<T = any> = {
	data?: T;
	totalCount?: number;
	loading: boolean;
	notFound: boolean;
	error?: any;
	refetch: () => Promise<any>;
}
