export function simplifyId(id: string, pattern: RegExp, blockHashIndex: number) {
	if (!id.match(pattern)) {
		// already simplified
		return id;
	}

	const parts = id.split("-");
	parts.splice(blockHashIndex, 1); // remove block hash part

	return parts.map(it => it.replace(/^0+/, "") || "0").join("-");
}
