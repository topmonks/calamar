/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { AccountBalance } from "../../model/accountBalance";
import { Resource } from "../../model/resource";
import { UsdRates } from "../../model/usdRates";
import { usdBalanceSum } from "../../utils/balance";
import { formatCurrency } from "../../utils/number";
import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { AccountPortfolioChartMode, AccountPortfolioChart } from "./AccountPortfolioChart";
import { chartStyle, notFoundStyle, separatorStyle, switchStyle, valuesStyle, valueStyle, valueTypeStyle } from "../ChartStyles";

export type AccountPortfolioProps = HTMLAttributes<HTMLDivElement> & {
	balances: Resource<AccountBalance[]>;
	usdRates: Resource<UsdRates>;
};

export const AccountPortfolio = (props: AccountPortfolioProps) => {
	const {balances, usdRates} = props;

	const [chartMode, setChartMode] = useState<AccountPortfolioChartMode>(AccountPortfolioChartMode.BY_NETWORK);

	const stats = useMemo(() => {
		return {
			total: usdBalanceSum(balances.data, "total", usdRates.data),
			free: usdBalanceSum(balances.data, "free", usdRates.data),
			reserved: usdBalanceSum(balances.data, "reserved", usdRates.data),
		};
	}, [balances, usdRates]);

	if (balances.loading || usdRates.loading) {
		return <Loading />;
	}

	if (balances.notFound || stats.total.eq(0)) {
		return <NotFound css={notFoundStyle}>No positive balances with conversion rate to USD found</NotFound>;
	}

	if (balances.error) {
		return (
			<ErrorMessage
				message="Unexpected error occured while fetching data"
				details={balances.error.message}
				showReported
			/>
		);
	}

	if (!balances.data || !usdRates.data) {
		return null;
	}

	return (
		<div>
			<ToggleButtonGroup css={switchStyle} value={chartMode} exclusive onChange={(_, mode) => setChartMode(mode)}>
				<ToggleButton size="small" value={AccountPortfolioChartMode.BY_NETWORK}>By network</ToggleButton>
				<ToggleButton size="small" value={AccountPortfolioChartMode.BY_TYPE}>By type</ToggleButton>
			</ToggleButtonGroup>
			<div css={valuesStyle}>
				<div css={valueStyle} data-test="porfolio-total">
					<div css={valueTypeStyle}>Total</div>
					<div>{formatCurrency(stats.total, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test="porfolio-free">
					<div css={valueTypeStyle}>Free</div>
					<div>{formatCurrency(stats.free, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
				<div css={separatorStyle} />
				<div css={valueStyle} data-test="porfolio-reserved">
					<div css={valueTypeStyle}>Reserved</div>
					<div>{formatCurrency(stats.reserved, "USD", {decimalPlaces: "optimal"})}</div>
				</div>
				<div css={separatorStyle} />
			</div>
			<AccountPortfolioChart
				css={chartStyle}
				balances={balances.data}
				usdRates={usdRates.data}
				mode={chartMode}
			/>
		</div>
	);
};
