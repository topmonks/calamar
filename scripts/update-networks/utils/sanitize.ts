export function sanitize (value?: string): string {
	return value?.toLowerCase().replace(/-/g, " ") || "";
}
