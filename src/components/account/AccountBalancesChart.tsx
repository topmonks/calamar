/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { css, Theme, useTheme } from "@emotion/react";
import { CallbackDataParams } from "echarts/types/dist/shared";

import { AccountBalance } from "../../model/accountBalance";
import { UsdRates } from "../../model/usdRates";
import { usdBalanceSum } from "../../utils/balance";
import { formatCurrency } from "../../utils/number";

import { PieChart, PieChartOptions } from "../PieChart";

const chartStyle = (theme: Theme) => css`
	width: 400px;
	height: 230px;

	${theme.breakpoints.down("sm")} {
		width: 230px;
		height: 270px;
	}

	.ECharts-tooltip {
		[data-class=title] {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 8px;
			font-weight: 600;
			font-size: 15px;
		}

		[data-class=icon] {
			height: 24px;
			width: 24px;
			object-fit: contain;
		}

		[data-class=value] {
			font-size: 15px;
		}

		[data-class=usd-value] {
			font-size: 14px;
			opacity: .75;
		}
	}
`;

export enum AccountBalanceChartMode {
	BY_NETWORK = "BY_NETWORK",
	BY_TYPE = "BY_TYPE"
}

export type AccountBalancesChartProps = HTMLAttributes<HTMLDivElement> & {
	balances: AccountBalance[];
	usdRates: UsdRates;
	mode: AccountBalanceChartMode;
};

export const AccountBalancesChart = (props: AccountBalancesChartProps) => {
	const {balances, usdRates, mode, ...divProps} = props;

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const totalData = useMemo(() => {
		if (!balances || !usdRates) {
			return [];
		}

		if (mode === AccountBalanceChartMode.BY_NETWORK) {
			return balances
				.filter(balance => balance.balance?.total.greaterThan(0) && usdRates[balance.network.name])
				.map(balance => {
					const rate = usdRates[balance.network.name]!;
					const usdValue = balance.balance!.total.mul(rate);

					return {
						value: usdValue.toNumber(),
						name: balance.network.displayName,
						itemStyle: {
							color: balance.network.color || "gray"
						},
						additionalData: {
							network: balance.network,
							formatted: formatCurrency(
								balance.balance!.total,
								balance.network.symbol,
								{
									decimalPlaces: "optimal",
									usdRate: rate
								}
							),
							formattedUsdValue: formatCurrency(usdValue, "USD", {decimalPlaces: "optimal"})
						}
					};
				})
				.sort((a, b) => b.value - a.value);
		} else {
			return [
				{
					name: "Free",
					sum: usdBalanceSum(balances, "free", usdRates),
					itemStyle: {
						color: theme.palette.primary.main,
					}
				},
				{
					name: "Reserved",
					sum: usdBalanceSum(balances, "reserved", usdRates),
					itemStyle: {
						color: theme.palette.primary.main,
						decal: {
							color: "#00000050",
							dashArrayX: [1, 0],
							dashArrayY: [2, 5],
							symbolSize: 2,
							rotation: Math.PI / 6
						}
					}
				}
			]
				.filter(it => it.sum.greaterThan(0))
				.map(({sum, ...it}) => {
					return {
						...it,
						value: sum.toNumber(),
						additionalData: {
							formattedUsdValue: formatCurrency(sum, "USD", {decimalPlaces: "optimal"})
						}
					};
				});
		}
	}, [balances, usdRates, mode, theme]);

	const options = useMemo<PieChartOptions>(() => {
		if (totalData.length === 0) {
			return {};
		}

		return {
			tooltip: {
				formatter: (params) => {
					const {name, data, percent} = params as CallbackDataParams;
					const {network, formatted, formattedUsdValue} = (data as any).additionalData;

					if (mode === AccountBalanceChartMode.BY_NETWORK) {
						return `
							<div data-class="title">
								<img src="${network.icon}" data-class="icon" />
								${network.displayName}
							</div>
							<div data-class="value">${formatted}</div>
							<div data-class="usd-value">${formattedUsdValue} (${percent}%)</div>
						`;
					} else {
						return `
							<div data-class="title">${name}</div>
							<div data-class="value">${formattedUsdValue} (${percent}%)</div>
						`;
					}
				}
			},
			legend: {
				textStyle: {
					width: 85,
					overflow: "truncate"
				},
				orient: isSmallScreen ? "horizontal" : "vertical",
				top: isSmallScreen ? "auto" : "center",
				left: isSmallScreen ? "center" : 275,
				bottom: isSmallScreen ? 0 : "auto",
				height: isSmallScreen ? "auto" : 140
			},
			series: {
				radius: [60, 100],
				center: isSmallScreen
					? ["center", 116]
					: [116, "center"],
				data: [
					...totalData,
				]
			},
		};
	}, [totalData, isSmallScreen, mode]);

	return (
		<PieChart options={options} css={chartStyle} {...divProps} />
	);
};
