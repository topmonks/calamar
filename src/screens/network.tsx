/** @jsxImportSource @emotion/react */
import { Theme, css } from "@emotion/react";

import BalancesTable from "../components/balances/BalancesTable";
import BlocksTable from "../components/blocks/BlocksTable";
import { Card, CardHeader, CardRow } from "../components/Card";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { NetworkStats } from "../components/network/NetworkStats";
import { NetworkTokenDistribution } from "../components/network/NetworkTokenDistribution";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import TransfersTable from "../components/transfers/TransfersTable";

import { useBalances } from "../hooks/useBalances";
import { useBlocks } from "../hooks/useBlocks";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { usePage } from "../hooks/usePage";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { useStats } from "../hooks/useStats";
import { useTab } from "../hooks/useTab";
import { useTransfers } from "../hooks/useTransfers";
import { useUsdRates } from "../hooks/useUsdRates";

import { hasSupport } from "../services/networksService";

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
	const { network } = useNetworkLoaderData();

	const [tab, setTab] = useTab();
	const [page, setPage] = usePage();

	console.log("tab", tab);

	const extrinsics = useExtrinsicsWithoutTotalCount(network.name, undefined, {
		page: tab === "extrinsics" ? page : 1,
		refreshFirstPage: true
	});

	const blocks = useBlocks(network.name, undefined, {
		page: tab === "blocks" ? page : 1,
		refreshFirstPage: true
	});

	const transfers = useTransfers(network.name, undefined, {
		page: tab === "transfers" ? page : 1,
		refreshFirstPage: true
	});

	const topHolders = useBalances(network.name, undefined, {
		order: "total_DESC",
		page: tab === "top-holders" ? page : 1,
		refreshFirstPage: true
	});

	const stats = useStats(network.name, undefined);

	const usdRates = useUsdRates();

	useDOMEventTrigger("data-loaded", !extrinsics.loading && !blocks.loading && !transfers.loading && !topHolders.loading && !usdRates.loading);

	// TODO
	/*useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);*/

	return (
		<>
			<CardRow>
				<Card data-test="network-stats">
					<CardHeader>
						<img css={networkIconStyle} src={network.icon} />
						{network.displayName}
					</CardHeader>
					{hasSupport(network.name, "stats-squid") &&
						<NetworkStats stats={stats} network={network} />
					}
				</Card>
				{hasSupport(network.name, "stats-squid") &&
					<Card css={tokenDistributionStyle} data-test="network-token-distribution">
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
			<Card data-test="network-related-items">
				<TabbedContent currentTab={tab} onTabChange={setTab}>
					<TabPane
						label="Extrinsics"
						count={extrinsics.totalCount}
						loading={extrinsics.loading}
						error={extrinsics.error}
						value="extrinsics"
					>
						<ExtrinsicsTable
							network={network}
							extrinsics={extrinsics}
							showAccount
							showTime
							onPageChange={setPage}
						/>
					</TabPane>
					<TabPane
						label="Blocks"
						count={blocks.totalCount}
						loading={blocks.loading}
						error={blocks.error}
						value="blocks"
					>
						<BlocksTable
							network={network}
							blocks={blocks}
							showValidator
							showTime
							onPageChange={setPage}
						/>
					</TabPane>
					{hasSupport(network.name, "main-squid") &&
						<TabPane
							label="Transfers"
							count={transfers.totalCount}
							loading={transfers.loading}
							error={transfers.error}
							value="transfers"
						>
							<TransfersTable
								network={network}
								transfers={transfers}
								showTime
								onPageChange={setPage}
							/>
						</TabPane>
					}
					{hasSupport(network.name, "stats-squid") &&
						<TabPane
							label="Top holders"
							count={topHolders.totalCount}
							loading={topHolders.loading}
							error={topHolders.error}
							value="top-holders"
						>
							<BalancesTable
								network={network}
								balances={topHolders}
								usdRates={usdRates}
								onPageChange={setPage}
							/>
						</TabPane>
					}
				</TabbedContent>
			</Card>
		</>
	);
};
