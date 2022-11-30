import { Resource } from "../model/resource";

export function combineResources(...resources: Resource<any>[]): Resource<any> {
	return {
		data: resources.map(it => it.data),
		loading: resources.some(it => it.loading),
		notFound: resources.every(it => it.notFound),
		error: resources.find(it => it.error)?.error,
		refetch: () => Promise.all(resources.map(it => it.refetch()))
	};
}
