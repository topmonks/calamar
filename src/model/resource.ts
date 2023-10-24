export type Resource<T = any> = {
	data?: T;
	loading: boolean;
	notFound: boolean;
	error?: any;
}
