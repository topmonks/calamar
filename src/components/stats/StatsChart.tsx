/** @jsxImportSource @emotion/react */
import { HTMLAttributes, useMemo } from "react";
import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import { PieChart, PieChartOptions } from "../PieChart";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { CallbackDataParams } from "echarts/types/dist/shared";
import { getNetwork } from "../../services/networksService";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { ErrorMessage } from "../ErrorMessage";
import { notFoundStyle, separatorStyle, valuesStyle, valueStyle, valueTypeStyle, chartStyle, chartMarginStyle } from "../ChartStyles";
import { formatCurrency } from "../../utils/number";

export type StatsChartProps = HTMLAttributes<HTMLDivElement> & {
	stats: Resource<Stats>;
	networkName: string;
}

export const StatsChart = (props: StatsChartProps) => {
	const { stats, networkName, ...divProps } = props;

	const network = getNetwork(networkName);

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

	const totalData = useMemo(() => {
		if (!stats.data) {
			return [];
		}

		return [
			{
				name: "Circulating",
				value: (stats.data.circulatingValueTotal),
				itemStyle: {
					color: network?.color || theme.palette.primary.main,
				}
			},
			{
				name: "Staked",
				value: (stats.data?.stakingTotalStake),
				itemStyle: {
					color: "gray"
				},
			},
			{
				name: "Other",
				value: (stats.data?.balancesTotalIssuance - stats.data.circulatingValueTotal - stats.data?.stakingTotalStake),
				itemStyle: {
					color: "lightgray"
				},
			}
		];
	}, [stats]);


	const options = useMemo<PieChartOptions>(() => {
		return {
			tooltip: {
				formatter: (params) => {
					const { name, value } = params as CallbackDataParams;

					console.log("PARAMS: ", params);

					return `
						<div data-class="title">${name}</div>
						<div data-class="value">${
	typeof value === "number" ? 
		formatCurrency(value, network ? network.symbol : "", { decimalPlaces: "optimal" })
		: value}</div>
					`;
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

	}, [totalData, isSmallScreen]);

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound css={notFoundStyle}>Stats not found.</NotFound>;
	}

	if (stats.error) {
		return (
			<ErrorMessage
				message="Unexpected error occured while fetching data"
				details={stats.error.message}
				showReported
			/>
		);
	}

	if (!stats.data || !network) {
		return null;
	}

	return (<>
		<div css={valuesStyle}>
			<div css={valueStyle} data-test="porfolio-total">
				<div css={valueTypeStyle}>Total issuance</div>
				<div>{formatCurrency(stats.data.balancesTotalIssuance, network.symbol, { decimalPlaces: "optimal" })}</div>
			</div>
		</div>
		<div css={chartMarginStyle}>
			<PieChart
				options={options}
				css={chartStyle}
				data-test={"stats-chart"}
				{...divProps}
			/>
		</div>
	</>
	);
};
