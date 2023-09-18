import { ItemsResponse } from "../model/itemsResponse";

export async function addItemMetadata<T, M>(
	response: T|undefined,
	getMetadata: (data: T) => M
) {
	if (response === undefined) {
		return undefined;
	}

	return {
		...response,
		metadata: await getMetadata(response)
	};
}


export async function addItemsMetadata<T, M>(
	response: ItemsResponse<T>,
	getMetadata: (data: T) => Promise<M>
) {
	const itemsWithMetadata = [];

	for (const item of response.data) {
		itemsWithMetadata.push({
			...item,
			metadata: await getMetadata(item)
		});
	}

	return {
		...response,
		data: itemsWithMetadata
	};
}
