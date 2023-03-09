import Decimal from "decimal.js";

const supportedFiatCurrencies = ["USD"];

export function formatNumber(value: number|Decimal) {
	if (!(value instanceof Decimal)) {
		value = new Decimal(value);
	}

	const valueString = value.toString();

	const [units] = valueString.split(".") as [string];

	return valueString.replace(units, Intl.NumberFormat("en-US").format(BigInt(units)));
}

export function formatCurrency(value: number|Decimal, currency: string) {
	const formattedNumber = formatNumber(value);

	// Intl formats fiat currencies using proper symbols like $
	if (supportedFiatCurrencies.includes(currency.toUpperCase())) {
		const template = Intl.NumberFormat("en-US", {style: "currency", currency}).format(0);
		return template.replace(/[0-9]+\.[0-9]+/, formattedNumber);
	}

	// cryptocurrencies are formatted simply using the code (KSM)
	return `${formattedNumber} ${currency}`;
}
