/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { css } from "@emotion/react";
import { Tooltip } from "@mui/material";
import Decimal from "decimal.js";

import { formatNumber } from "../utils/number";

const zeroAmountStyle = css`
	opacity: .65;
`;

export type CurrencyProps = {
	amount: Decimal;
	symbol?: string;
}

export const Currency = (props: CurrencyProps) => {
	const {amount, symbol} = props;

	const rounded = useMemo(() => {
		// TODO count new scale from USD price (to show up
		// to least significant decimal with value >= 0.01 USD)

		return amount.toDecimalPlaces(4, Decimal.ROUND_HALF_UP);
	}, [amount]);

	return (
		<Tooltip
			arrow
			placement="top"
			title={`${formatNumber(amount)} ${symbol}`.trim()}
		>
			<span css={amount.isZero() && zeroAmountStyle}>
				<span>{formatNumber(rounded)}</span>
				{symbol && <span> {symbol}</span>}
			</span>
		</Tooltip>
	);
};
