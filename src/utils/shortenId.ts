export const shortenId = (id: string) => {
	return id.split("-").slice(0, -1).map(it => it.replace(/^0+([^0]+)$/, "$1")).join("-");
	return id.replace(/(^|-)0+([^-])/g, "$1$2").replace(/-[^-]*$/, "");
};
