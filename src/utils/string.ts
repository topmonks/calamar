export function upperFirst(str: string): string {
	return `${str[0]?.toUpperCase() || ""}${str.slice(1)}`;
}

export function lowerFirst(str: string): string {
	return `${str[0]?.toLowerCase() || ""}${str.slice(1)}`;
}

/**
 * Remove any casing and convert to lowercase.
 */
export function noCase(str: string) {
	return str.replace(/[\s\-_]/g, "").toLowerCase();
}

export function tryParseInt(str?: string) {
	if (!str) {
		return undefined;
	}

	return +str || undefined;
}
