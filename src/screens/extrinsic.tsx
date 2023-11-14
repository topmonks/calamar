/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallsTable } from "../components/calls/CallsTable";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import { ExtrinsicInfoTable } from "../components/extrinsics/ExtrinsicInfoTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useCalls } from "../hooks/useCalls";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { usePage } from "../hooks/usePage";
import { useNetworkLoaderData } from "../hooks/useNetworkLoaderData";
import { useTab } from "../hooks/useTab";

type ExtrinsicPageParams = {
	id: string;
};

export const ExtrinsicPage = () => {
	const { network } = useNetworkLoaderData();
	const { id } = useParams() as ExtrinsicPageParams;

	const [tab, setTab] = useTab();
	const [page, setPage] = usePage();

	const extrinsic = useExtrinsic(network.name, { simplifiedId: id });

	const events = useEvents(network.name, extrinsic.data && { extrinsicId: extrinsic.data.id }, {
		order: "id_ASC",
		page: tab === "events" ? page : 1,
		skip: !extrinsic.data
	});

	const calls = useCalls(network.name, extrinsic.data && { extrinsicId: extrinsic.data.id }, {
		order: "id_ASC",
		page: tab === "calls" ? page : 1,
		skip: !extrinsic.data
	});

	useDOMEventTrigger("data-loaded", !extrinsic.loading && !events.loading && !calls.loading);

	return (
		<>
			<Card>
				<CardHeader>
					Extrinsic #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<ExtrinsicInfoTable
					network={network}
					extrinsic={extrinsic}
				/>
			</Card>
			{extrinsic.data &&
				<Card>
					<TabbedContent currentTab={tab} onTabChange={setTab}>
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
					</TabbedContent>
				</Card>
			}
		</>
	);
};
