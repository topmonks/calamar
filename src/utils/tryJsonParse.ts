export function tryJsonParse(value: any) {
	try {
		return JSON.parse(value);
	} catch (e) {
		return value;
	}
}
