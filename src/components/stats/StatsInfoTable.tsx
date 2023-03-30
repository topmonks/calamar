/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";
import { ErrorMessage } from "../ErrorMessage";
import Loading from "../Loading";
import NotFound from "../NotFound";
import { StatItem, StatsLayout } from "../StatsLayout";

const notFoundStyle = css`
	margin: 0 auto;
	max-width: 300px;
`;

export type StatsInfoTableProps = {
	stats: Resource<Stats>;
}

export const StatsInfoTable = (props: StatsInfoTableProps) => {
	const { stats } = props;


	const stakedValuePercentage =  stats.data?.totalIssuance ? (stats.data?.stakedValueTotal / stats.data?.totalIssuance * 100).toFixed(1) : 0;

	if (stats.loading) {
		return <Loading />;
	}

	if (stats.notFound) {
		return <NotFound css={notFoundStyle}>Stats are currently unavailable.</NotFound>;
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
		<StatsLayout>
			<StatItem title="Finalized blocks" value={stats.data?.finalizedBlocks} />
			<StatItem title="Signed extrinsics" value={stats.data?.signedExtrinsics} />
			<StatItem title="Transfers" value={stats.data?.transfersCount} />
			<StatItem title="Holders" value={stats.data?.holders} />
			<StatItem title="Total issuance" value={stats.data?.totalIssuance} />
			<StatItem title="Staked value" value={`${stats.data?.stakedValueTotal} (${stakedValuePercentage}%)`} />
			<StatItem title="Validators" value={`${stats.data?.validatorsCount}/${stats.data?.validatorsIdealCount}`} />
			<StatItem title="Nomination pools" value={`${stats.data?.nominationPoolsCountPools}`} />
		</StatsLayout>
	);
};
