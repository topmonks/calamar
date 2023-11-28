export function isDeepEqual(a: any, b: any): boolean {
	if (a === b) {
		return true;
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return a.length === b.length
			&& a.every((value, key) => isDeepEqual(value, b[key]));
	}

	if (typeof a === "object" && typeof b === "object") {
		return isDeepEqual(Object.entries(a), Object.entries(b));
	}

	return false;
}

export function isSubset(a: any, b: any): boolean {
	return Object.keys(a).every((key) => {
		if (a[key] === b[key]) {
			return true;
		}

		if (Array.isArray(a[key]) && Array.isArray(b[key])) {
			return isDeepEqual(a[key], b[key]);
		}

		if (typeof a[key] === "object" && typeof b[key] === "object") {
			return isSubset(a[key], b[key]);
		}

		return false;
	});
}
