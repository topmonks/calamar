export function uniq<T>(array: T[]) {
	return Array.from(new Set(array));
}
