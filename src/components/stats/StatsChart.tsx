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
import { chartStyle, notFoundStyle, separatorStyle, valuesStyle, valueStyle, valueTypeStyle } from "../ChartStyles";


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
				value: (stats.data?.totalIssuance - stats.data?.stakedValueTotal),
				itemStyle: {
					color: network?.color || theme.palette.primary.main,
				}
			},
			{
				name: "Staked",
				value: (stats.data?.stakedValueTotal),
				itemStyle: {
					color: "gray"
				},
			}
		];
	}, [stats]);


	const options = useMemo<PieChartOptions>(() => {
		if (totalData.length === 0) {
			return {};
		}

		const thing: PieChartOptions = {
			tooltip: {
				formatter: (params) => {
					const { name, value } = params as CallbackDataParams;

					console.log("PARAMS: ", params);

					return `
						<div data-class="title">${name}</div>
						<div data-class="value">${value}</div>
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
		return thing;
	}, [totalData, isSmallScreen]);

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound css={notFoundStyle}>Stats are currently unavailable for {networkName}.</NotFound>;
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

	if (!stats.data) {
		return null;
	}

	return (<>
		<div css={valuesStyle}>
			<div css={valueStyle} data-test="porfolio-total">
				<div css={valueTypeStyle}>Circulating</div>
				<div>{stats.data?.totalIssuance - stats.data?.stakedValueTotal}</div>
			</div>
			<div css={separatorStyle} />
			<div css={valueStyle} data-test="porfolio-free">
				<div css={valueTypeStyle}>Staked</div>
				<div>{stats.data?.stakedValueTotal}</div>
			</div>
			<div css={separatorStyle} />
		</div>
		<PieChart
			options={options}
			css={chartStyle}
			data-test={"stats-chart"}
			{...divProps}
		/>
	</>
	);
};
