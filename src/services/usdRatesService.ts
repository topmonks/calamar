import Decimal from "decimal.js";
import { UsdRates } from "../model/usdRates";
import { rollbar } from "../rollbar";

import { getNetworks } from "./networksService";

export const USD_RATES_REFRESH_RATE = 60000; // 1 minute

export async function getUsdRates() {
	await window.navigator.locks.request("usd-rates", async () => {
		const usdRatesUpdatedAt = loadUsdRatesUpdatedAt();
		const coinGeckoWaitUntil = loadCoinGeckoWaitUntil();

		const nextRefreshAt = Math.max(
			usdRatesUpdatedAt + USD_RATES_REFRESH_RATE,
			coinGeckoWaitUntil
		);

		if (Date.now() < nextRefreshAt) {
			return;
		}

		try {
			const usdRates = await fetchUsdRates();
			storeUsdRates(usdRates);
			storeUsdRatesUpdatedAt(Date.now());
		} catch(e: any) {
			// probably rate limit exceede wait 2 minutes
			storeCoinGeckoWaitUntil(Date.now() + 120000);
			rollbar.error("CoinGecko error", e);
			console.error("CoinGecko error", e);
		}
	});

	return loadUsdRates();
}

export function getUsdRatesUpdatedAt() {
	return loadUsdRatesUpdatedAt();
}

/*** PRIVATE ***/

function loadUsdRates() {
	try {
		return JSON.parse(
			localStorage.getItem("usd-rates") || "{}",
			(key, value) => key ? new Decimal(value) : value
		) as UsdRates;
	} catch(e) {
		return {};
	}
}

function storeUsdRates(usdRates: UsdRates) {
	localStorage.setItem("usd-rates", JSON.stringify(usdRates));
}

function loadUsdRatesUpdatedAt() {
	return parseInt(localStorage.getItem("usd-rates-updated-at") || "0");
}

function storeUsdRatesUpdatedAt(time: number) {
	localStorage.setItem("usd-rates-updated-at", time.toString());
}

function loadCoinGeckoWaitUntil() {
	return parseInt(localStorage.getItem("coingecko-wait-until") || "0");
}

function storeCoinGeckoWaitUntil(time: number) {
	localStorage.setItem("coingecko-wait-until", time.toString());
}

async function fetchUsdRates() {
	console.log("fetchUsdRates");
	const networks = getNetworks().filter(it => it.coinGeckoId);
	const coinGeckoIds = networks.map(it => it.coinGeckoId);

	const apiUrl = new URL("https://api.coingecko.com/api/v3/simple/price");
	apiUrl.searchParams.set("ids", coinGeckoIds.join(","));
	apiUrl.searchParams.set("vs_currencies", "usd");
	apiUrl.searchParams.set("precision", "full");

	const response = await fetch(apiUrl);

	if (response.status !== 200) {
		throw new Error(`CoinGecko non 200 reponse status: ${response.status}`);
	}

	const data = await response.json();

	const usdRates: UsdRates = {};

	for (const network of networks) {
		if (network.coinGeckoId && data[network.coinGeckoId]?.usd) {
			usdRates[network.name] = new Decimal(data[network.coinGeckoId].usd);
		}
	}

	return usdRates;
}
