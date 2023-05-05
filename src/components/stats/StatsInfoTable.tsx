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
import Transfer from "../../assets/transfer.svg";
import Holder from "../../assets/holder.svg";
import Nominator from "../../assets/nominator.svg";
import Stake from "../../assets/stake.svg";
import Validator from "../../assets/validator.svg";
import Token from "../../assets/token.svg";
import { css } from "@emotion/react";

const StatsLayoutStyle = css`
    display: grid;
    width: 100%;
    height: auto;

    gap: 10px;

    grid-template-columns: repeat(4, auto);

    @media (max-width: 1500px) {
        grid-template-columns: repeat(2, auto);
	}
`;

export type StatsInfoTableProps = {
	stats: Resource<Stats>;
}

export const StatsInfoTable = (props: StatsInfoTableProps) => {
	const { stats } = props;

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

	if (!stats.data) {
		return null;
	}
	
	return (
		<div css={StatsLayoutStyle}>
			<StatItem title="Finalized blocks" value={stats.data?.chainFinalizedBlocks} icon={Block} />
			<StatItem title="Signed extrinsics" value={stats.data?.chainSignedExtrinsics} icon={Signed} />
			<StatItem title="Transfers" value={stats.data?.balancesTransfersAmount} icon={Transfer} />
			<StatItem title="Holders" value={stats.data?.holders} icon={Holder} />
			<StatItem title="Total issuance" value={stats.data?.balancesTotalIssuance.toFixed(1)} icon={Token} />
			<StatItem
				title="Staked value"
				value={`${stats.data?.stakingTotalStake.toFixed(1)} (${stats.data?.stakedValuePercentage.toFixed(1)}%)`}
				icon={Stake} />
			<StatItem
				title="Validators"
				value={`${stats.data?.stakingValidatorsAmount}/${stats.data?.stakingValidatorsIdealAmount}`}
				icon={Validator} />
			<StatItem title="Nomination pools" value={`${stats.data?.nominationPoolsCountPools}`} icon={Nominator} />
		</div>
	);
};
