export const shortenHash = (hash?: string) => {
	if (!hash || hash.length < 15) {
		return hash;
	}

	return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
};
