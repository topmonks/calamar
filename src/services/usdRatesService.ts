import Decimal from "decimal.js";
import { USDRates } from "../model/usdRates";
import { rollbar } from "../rollbar";

import { getNetworks } from "./networksService";

export const USD_RATES_REFRESH_RATE = 60000; // 1 minute

export async function getUSDRates() {
	await window.navigator.locks.request("usd-rates", async () => {
		const usdRatesUpdatedAt = loadUSDRatesUpdatedAt();
		const coinGeckoWaitUntil = loadCoinGeckoWaitUntil();

		const nextRefreshAt = Math.max(
			usdRatesUpdatedAt + USD_RATES_REFRESH_RATE,
			coinGeckoWaitUntil
		);

		if (Date.now() < nextRefreshAt) {
			return;
		}

		try {
			const usdRates = await fetchUSDRates();
			storeUSDRates(usdRates);
			storeUSDRatesUpdatedAt(Date.now());
		} catch(e: any) {
			// probably rate limit exceeded, wait 2 minutes
			storeCoinGeckoWaitUntil(Date.now() + 120000);
			rollbar.error("CoinGecko error", e);
			console.error("CoinGecko error", e);
		}
	});

	return loadUSDRates();
}

export function getUSDRatesUpdatedAt() {
	return loadUSDRatesUpdatedAt();
}

/*** PRIVATE ***/

function loadUSDRates() {
	try {
		return JSON.parse(
			localStorage.getItem("usd-rates") || "{}",
			(key, value) => key ? new Decimal(value) : value
		) as USDRates;
	} catch(e) {
		return {};
	}
}

function storeUSDRates(usdRates: USDRates) {
	localStorage.setItem("usd-rates", JSON.stringify(usdRates));
}

function loadUSDRatesUpdatedAt() {
	return parseInt(localStorage.getItem("usd-rates-updated-at") || "0");
}

function storeUSDRatesUpdatedAt(time: number) {
	localStorage.setItem("usd-rates-updated-at", time.toString());
}

function loadCoinGeckoWaitUntil() {
	return parseInt(localStorage.getItem("coingecko-wait-until") || "0");
}

function storeCoinGeckoWaitUntil(time: number) {
	localStorage.setItem("coingecko-wait-until", time.toString());
}

async function fetchUSDRates() {
	console.log("fetchUSDRates");
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

	const usdRates: USDRates = {};

	for (const network of networks) {
		if (network.coinGeckoId && data[network.coinGeckoId]?.usd) {
			usdRates[network.name] = new Decimal(data[network.coinGeckoId].usd);
		}
	}

	return usdRates;
}
