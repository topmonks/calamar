export function upperFirst(str: string): string {
	return `${str[0]?.toUpperCase()}${str.slice(1)}`;
}

export function lowerFirst(str: string): string {
	return `${str[0]?.toLowerCase()}${str.slice(1)}`;
}
