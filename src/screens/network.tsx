/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { Theme, css } from "@emotion/react";

import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { Card, CardHeader, CardRow } from "../components/Card";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useTransfers } from "../hooks/useTransfers";
import TransfersTable from "../components/transfers/TransfersTable";
import { hasSupport } from "../services/networksService";
import { useBlocks } from "../hooks/useBlocks";
import BlocksTable from "../components/blocks/BlocksTable";
import { useBalances } from "../hooks/useBalances";
import BalancesTable from "../components/balances/BalancesTable";
import { useStats } from "../hooks/useStats";
import { NetworkStats } from "../components/network/NetworkStats";
import { useUsdRates } from "../hooks/useUsdRates";
import { useRootLoaderData } from "../hooks/useRootLoaderData";
import { NetworkTokenDistribution } from "../components/network/NetworkTokenDistribution";

const networkIconStyle = css`
	vertical-align: text-bottom;
	margin-right: 8px;
	height: 32px;
`;

const tokenDistributionStyle = (theme: Theme) => css`
	flex: 0 0 auto;
	width: 400px;

	${theme.breakpoints.down("lg")} {
		width: auto;
	}
`;

export const NetworkPage = () => {
	const { network } = useRootLoaderData();

	const extrinsics = useExtrinsicsWithoutTotalCount(network.name, undefined, "id_DESC");
	const blocks = useBlocks(network.name, undefined, "id_DESC");
	const transfers = useTransfers(network.name, undefined, "id_DESC");
	const topHolders = useBalances(network.name, undefined, "total_DESC");

	const stats = useStats(network.name, undefined);

	const usdRates = useUsdRates();

	useDOMEventTrigger("data-loaded", !extrinsics.loading && !blocks.loading && !transfers.loading && !topHolders.loading && !usdRates.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<CardRow>
				<Card>
					<CardHeader>
						<img css={networkIconStyle} src={network.icon} />
						{network.displayName}
					</CardHeader>
					{hasSupport(network.name, "stats-squid") &&
						<NetworkStats stats={stats} networkName={network.name} />
					}
				</Card>
				{hasSupport(network.name, "stats-squid") &&
					<Card css={tokenDistributionStyle}>
						<CardHeader>
							Token distribution
						</CardHeader>
						<NetworkTokenDistribution
							stats={stats}
							network={network}
						/>
					</Card>
				}
			</CardRow>


			<Card>
				<TabbedContent>
					<TabPane
						label="Extrinsics"
						count={extrinsics.pagination.totalCount}
						loading={extrinsics.loading}
						error={extrinsics.error}
						value="extrinsics"
					>
						<ExtrinsicsTable network={network.name} extrinsics={extrinsics} showAccount showTime />
					</TabPane>
					<TabPane
						label="Blocks"
						count={blocks.pagination.totalCount}
						loading={blocks.loading}
						error={blocks.error}
						value="blocks"
					>
						<BlocksTable network={network.name} blocks={blocks} showValidator showTime />
					</TabPane>


					{hasSupport(network.name, "main-squid") &&
							<TabPane
								label="Transfers"
								count={transfers.pagination.totalCount}
								loading={transfers.loading}
								error={transfers.error}
								value="transfers"
							>
								<TransfersTable network={network.name} transfers={transfers} showTime />
							</TabPane>
					}
					{hasSupport(network.name, "stats-squid") &&
							<TabPane
								label="Top holders"
								count={topHolders.pagination.totalCount}
								loading={topHolders.loading}
								error={topHolders.error}
								value="top-holders"
							>
								<BalancesTable network={network.name} balances={topHolders} usdRates={usdRates} />
							</TabPane>
					}
				</TabbedContent>
			</Card>
		</>
	);
};
