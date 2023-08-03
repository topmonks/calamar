/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";

import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { formatCurrency } from "../../utils/number";
import { Theme } from "@mui/material";

const statStyle = css`
  min-width: 100px;
  width: 100%;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const statIconStyle = css`
  width: 44px;
  height: 44px;
  margin-right: 10px;
  padding: 10px;
`;

const statTitleStyle = (theme: Theme) => css`
  font-weight: 500;
  margin-top: auto;
  font-size: 13px;
  color: ${theme.palette.secondary.dark}
`;

const statValueStyle = (theme: Theme) => css`
  font-weight: 600;
  height: 32px;
  font-size: 15px;
  color: ${theme.palette.secondary.light}
`;

const statsLayoutStyle = css`
  display: grid;
  width: 100%;
  height: auto;

  gap: 10px;

  grid-template-columns: repeat(2, auto);

  @media (max-width: 530px) {
    grid-template-columns: repeat(1, auto);
  }
`;

type StatItemProps = {
	title: string;
	icon?: string;
	value?: string | number;
};

const StatItem = (props: StatItemProps) => {
	const { title, value, icon } = props;

	return (
		<div css={statStyle}>
			<img css={statIconStyle} src={icon} />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<div css={statTitleStyle}>{title}</div>
				<div css={statValueStyle}>{value}</div>
			</div>
		</div>
	);
};

export type NetworkInfoTableProps = {
	stats: Resource<Stats>;
};

export const NetworkStats = (props: NetworkInfoTableProps) => {
	const { stats } = props;

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound>Stats not found.</NotFound>;
	}

	if (stats.error) {
		return (
			<ErrorMessage
				message='Unexpected error occured while fetching data'
				details={stats.error.message}
				showReported
			/>
		);
	}

	if (!stats.data) {
		return null;
	}

	return (
		<div css={statsLayoutStyle}>
			<StatItem
				title='Price'
				value={`$ ${formatCurrency(stats.data.price, "USD", {
					decimalPlaces: "optimal",
				})}`}
				// icon={Validator}
			/>
			<StatItem
				title='24h change'
				value={`${stats.data.priceChange24h}%`}
				// icon={Nominator}
			/>
			<StatItem
				title='Market Cap'
				value={`$ ${formatCurrency(stats.data.marketCap, "USD")}`}
				// icon={Nominator}
			/>
			<StatItem
				title='Validating APY'
				value={`${stats.data.validationAPY}%`}
				// icon={Nominator}
			/>
			<StatItem
				title='Staking APY'
				value={`${stats.data.stakingAPY}%`}
				// icon={Nominator}
			/>
		</div>
	);
};
