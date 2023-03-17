import Decimal from "decimal.js";

const supportedFiatCurrencies = ["USD"];

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


/*let roundToDecimalPlaces = decimalPlaces;

if (autoDecimalPlaces) {
	if (usdRate) {
		// if USD rate is specified, round to most significant decimal place of approx $0.01 value
		const usdValueOfOneHundredth = new Decimal("0.01").div(usdRate);
		const mostSignificantDecimalPlace = usdValueOfOneHundredth.log().neg().ceil().toNumber();
		roundToDecimalPlaces = mostSignificantDecimalPlace;
	} else if (symbol?.toUpperCase() === "USD") {
		// otherwise use default decimal places for USD
		roundToDecimalPlaces = 2;
	} else {
		// otherwise use default decimal places for crypto
		roundToDecimalPlaces = 4;
	}
}

if (!roundToDecimalPlaces) {
	return amount;
}

return amount.toDecimalPlaces(roundToDecimalPlaces, Decimal.ROUND_HALF_UP);*/

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
