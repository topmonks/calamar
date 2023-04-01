import Decimal from "decimal.js";

import { Network } from "../model/network";

const supportedFiatCurrencies = ["USD"];

export function rawAmountToDecimal(network: Network, amount: string|undefined) {
	const scale = new Decimal(10).pow(network.decimals * -1);
	return new Decimal(amount || 0).mul(scale);
}

export type FormatNumberOptions = {
	decimalPlaces?: number;
}

export function formatNumber(value: number|Decimal, options: FormatNumberOptions = {}) {
	if (!(value instanceof Decimal)) {
		value = new Decimal(value);
	}

	if (options.decimalPlaces) {
		value = value.toDecimalPlaces(options.decimalPlaces, Decimal.ROUND_HALF_UP);
	}

	const valueString = value.toString();

	const [units] = valueString.split(".") as [string];

	return valueString.replace(units, Intl.NumberFormat("en-US").format(BigInt(units)));
}

export type FormatCurrencyOptions = {
	decimalPlaces?: "optimal"|number;
	minimalUsdValue?: Decimal;
	usdRate?: Decimal;
}

export function formatCurrency(value: number|Decimal, currency: string, options: FormatCurrencyOptions = {}) {
	let decimalPlaces = options.decimalPlaces;

	if (decimalPlaces === "optimal") {
		decimalPlaces =
			options.usdRate ? getOptimalDecimalPlaces(options.usdRate, options.minimalUsdValue)
				: currency.toUpperCase() === "USD" ? 2 // default for USD
					: 4; // default for crypto
	}

	const formattedNumber = formatNumber(value, {decimalPlaces});

	// Intl formats fiat currencies using proper symbols like $
	if (supportedFiatCurrencies.includes(currency.toUpperCase())) {
		const template = Intl.NumberFormat("en-US", {style: "currency", currency}).format(0);
		return template.replace(/[0-9]+\.[0-9]+/, formattedNumber);
	}

	// cryptocurrencies are formatted simply using the code (KSM)
	return `${formattedNumber} ${currency}`;
}


/**
 * Get optimal decimal places for a cryptocurrency to able
 * to represent minimal USD value after rounding.
 *
 * @param usdRate
 * @param minimalUsdValue
 * @param defaultDecimalPlaces
 * @returns
 */
export function getOptimalDecimalPlaces(usdRate: Decimal, minimalUsdValue = new Decimal("0.01")) {
	const cryptoValueOfMinimalUsdValue = minimalUsdValue.div(usdRate);
	const mostSignificantDecimalPlace = cryptoValueOfMinimalUsdValue.log().neg().ceil().toNumber();
	return mostSignificantDecimalPlace;
}
