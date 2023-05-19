export function uniq<T>(array: T[]) {
	return Array.from(new Set(array));
}

export function uniqBy<T>(array: T[], propGetter: (it: T) => any) {
	const result = [];

	const set = new Set();
	for (const item of array) {
		const prop = propGetter(item);

		if(!set.has(prop)) {
			set.add(prop);
			result.push(item);
		}
	}

	return result;
}
