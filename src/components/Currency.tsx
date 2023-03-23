/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { css } from "@emotion/react";
import { Tooltip } from "@mui/material";
import Decimal from "decimal.js";

import { formatCurrency } from "../utils/number";

const wrapperStyle = css`
	display: inline-block;
`;

const zeroAmountStyle = css`
	opacity: .65;
`;

const usdValueStyle = css`
	font-size: 15px;
	opacity: .75;
`;

export type CurrencyProps = HTMLAttributes<HTMLDivElement> & {
	amount: Decimal;
	symbol?: string;
	autoDecimalPlaces?: boolean;
	decimalPlaces?: number;
	showFullInTooltip?: boolean;
	usdRate?: Decimal;
	showUSDValue?: boolean;
}

export const Currency = (props: CurrencyProps) => {
	const {amount, symbol, autoDecimalPlaces, decimalPlaces, showFullInTooltip, usdRate, showUSDValue, ...divProps} = props;

	const usdValue = useMemo(() => usdRate && amount.mul(usdRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP), [amount, usdRate]);

	const rounded = useMemo(() => {
		let roundToDecimalPlaces = decimalPlaces;

		if (autoDecimalPlaces) {
			if (usdRate) {
				// if USD rate is specified, round to most significant decimal place of approx $0.01 value
				const usdValueOfOneHundredth = new Decimal("0.01").div(usdRate);
				const mostSignificantDecimalPlace = usdValueOfOneHundredth.log().neg().ceil().toNumber();
				roundToDecimalPlaces = mostSignificantDecimalPlace;
			}

			// otherwise use default decimal places
			if (symbol?.toUpperCase() === "USD") {
				roundToDecimalPlaces = 2;
			} else {
				roundToDecimalPlaces = 4;
			}
		}

		if (!roundToDecimalPlaces) {
			return amount;
		}

		return amount.toDecimalPlaces(roundToDecimalPlaces, Decimal.ROUND_HALF_UP);
	}, [amount, symbol, decimalPlaces, usdRate]);

	return (
		<div css={wrapperStyle} {...divProps}>
			<Tooltip
				arrow
				placement="top"
				title={formatCurrency(showFullInTooltip ? amount : rounded, symbol || "")}
			>
				<div css={amount.isZero() && zeroAmountStyle}>
					{formatCurrency(rounded, symbol || "")}
				</div>
			</Tooltip>
			{showUSDValue && usdValue && usdValue.greaterThan(0) &&
				<div css={usdValueStyle}>{formatCurrency(usdValue, "USD")}</div>
			}
		</div>
	);
};
