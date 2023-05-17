/** @jsxImportSource @emotion/react */
import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import { notFoundStyle } from "../ChartStyles";
import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { StatItem } from "../StatsLayout";
import Block from "../../assets/block.svg";
import Signed from "../../assets/signed.svg";
import Nominator from "../../assets/nominator.svg";
import Validator from "../../assets/validator.svg";
import Inflation from "../../assets/inflation.svg";
import StakingReward from "../../assets/staking-reward.svg";

import { css } from "@emotion/react";
import { getNetwork } from "../../services/networksService";

const StatsLayoutStyle = css`
    display: grid;
    width: 100%;
    height: auto;

    gap: 10px;

	grid-template-columns: repeat(2, auto);
    
	@media (max-width: 530px) {
        grid-template-columns: repeat(1, auto);
	}
`;

export type StatsInfoTableProps = {
	stats: Resource<Stats>;
	networkName: string;
}

export const StatsInfoTable = (
	props: StatsInfoTableProps,
) => {
	const { stats, networkName } = props;

	const network = getNetwork(networkName);

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

	return (
		<div css={StatsLayoutStyle}>
			<StatItem title="Finalized blocks" value={stats.data?.chainFinalizedBlocks} icon={Block} />
			<StatItem title="Signed extrinsics" value={stats.data?.chainSignedExtrinsics} icon={Signed} />
			<StatItem title="Staking inflation" value={`${stats.data?.stakingInflationRatio.toFixed(1)}%`} icon={Inflation} />
			<StatItem title="Staking rewards" value={`${stats.data?.stakingRewardsRatio.toFixed(1)}%`} icon={StakingReward} />
			<StatItem
				title="Validators"
				value={`${stats.data?.stakingActiveValidatorsAmount}/${stats.data?.stakingValidatorsIdealAmount}`}
				icon={Validator} />
			<StatItem title="Nomination pools" value={`${stats.data?.nominationPoolsPoolsActiveAmount}`} icon={Nominator} />
		</div>
	);
};
