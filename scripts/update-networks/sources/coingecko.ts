import { log } from "../utils/log";

export async function getCoinGeckoCoins() {
	const response = await fetch("https://api.coingecko.com/api/v3/coins/list");

	if (response.status === 429) {
		log.flush();
		log(log.error, "CoinGecko API rate limit exceeded, try again after 1 minute");
		throw new Error();
	}

	return await response.json();
}
