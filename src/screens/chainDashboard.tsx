/** @jsxImportSource @emotion/react */
import { useEffect } from "react";

import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

import { Card, CardHeader } from "../components/Card";
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
import { useUsdRates } from "../hooks/useUsdRates";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

export const ChainDashboardPage = () => {
	const { network } = useRootLoaderData();

	const extrinsics = useExtrinsicsWithoutTotalCount(network.name, undefined, "id_DESC");
	const blocks = useBlocks(network.name, undefined, "id_DESC");
	const transfers = useTransfers(network.name, undefined, "id_DESC");
	const topHolders = useBalances(network.name, undefined, "total_DESC");

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
			<Card>
				<CardHeader>
					{network.displayName} dashboard
				</CardHeader>
			</Card>
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
					{hasSupport(network.name, "balances-squid") &&
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
