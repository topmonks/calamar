import { useParams } from "react-router-dom";

import { BlockInfoTable } from "../components/blocks/BlockInfoTable";
import { CallsTable } from "../components/calls/CallsTable";
import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useBlock } from "../hooks/useBlock";
import { useCalls } from "../hooks/useCalls";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useNetworkLoaderData } from "../hooks/useNetworkLoaderData";
import { usePage } from "../hooks/usePage";
import { useTab } from "../hooks/useTab";

export type BlockPageParams = {
	id: string;
	tab?: string;
};

export const BlockPage = () => {
	const { network } = useNetworkLoaderData();
	const { id } = useParams() as BlockPageParams;

	const [tab, setTab] = useTab();
	const [page, setPage] = usePage();

	const block = useBlock(network.name, { simplifiedId: id });

	const extrinsics = useExtrinsics(network.name, block.data && { blockId: block.data.id }, {
		order: "id_ASC",
		page: tab === "extrinsics" ? page : 1,
		refreshFirstPage: true,
		skip: !block.data
	});

	const events = useEvents(network.name, block.data && { blockId: block.data.id }, {
		order: "id_ASC",
		page: tab === "events" ? page : 1,
		refreshFirstPage: true,
		skip: !block.data
	});

	const calls = useCalls(network.name, block.data && { blockId: block.data.id }, {
		order: "id_ASC",
		page: tab === "calls" ? page : 1,
		refreshFirstPage: true,
		skip: !block.data
	});

	useDOMEventTrigger("data-loaded", !block.loading && !extrinsics.loading && !events.loading && !calls.loading);

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
							<ExtrinsicsTable
								network={network}
								extrinsics={extrinsics}
								showAccount
								onPageChange={setPage}
							/>
						</TabPane>
						<TabPane
							label="Calls"
							count={calls.totalCount}
							loading={calls.loading}
							error={calls.error}
							value="calls"
						>
							<CallsTable
								network={network}
								calls={calls}
								showAccount
								onPageChange={setPage}
							/>
						</TabPane>
						<TabPane
							label="Events"
							count={events.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable
								network={network}
								events={events}
								showExtrinsic
								onPageChange={setPage}
							/>
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
