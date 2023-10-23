import { useCallback, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { BlockInfoTable } from "../components/blocks/BlockInfoTable";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import EventsTable from "../components/events/EventsTable";
import { useBlock } from "../hooks/useBlock";
import { useCalls } from "../hooks/useCalls";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { useTabParam } from "../hooks/useTabParam";

export type BlockPageParams = {
	id: string;
	tab?: string;
};

export const BlockPage = () => {
	const { network } = useNetworkLoaderData();
	const { id } = useParams() as BlockPageParams;

	const [tab, setTab] = useTabParam();

	const block = useBlock(network.name, { id_eq: id });

	const extrinsics = useExtrinsics(network.name, { blockId_eq: id }, "id_DESC");
	const events = useEvents(network.name, { blockId_eq: id }, "id_DESC");
	const calls = useCalls(network.name, { blockId_eq: id }, "id_DESC");

	useDOMEventTrigger("data-loaded", !block.loading && !extrinsics.loading && !events.loading && !calls.loading);

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
					Block #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<BlockInfoTable
					network={network}
					block={block}
				/>
			</Card>
			{block.data &&
				<Card>
					<TabbedContent currentTab={tab} onTabChange={setTab}>
						<TabPane
							label="Extrinsics"
							count={extrinsics.totalCount}
							loading={extrinsics.loading}
							error={extrinsics.error}
							value="extrinsics"
						>
							<ExtrinsicsTable network={network} extrinsics={extrinsics} showAccount />
						</TabPane>
						<TabPane
							label="Calls"
							count={calls.totalCount}
							loading={calls.loading}
							error={calls.error}
							value="calls"
						>
							<CallsTable network={network} calls={calls} showAccount />
						</TabPane>
						<TabPane
							label="Events"
							count={events.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable network={network} events={events} showExtrinsic />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
