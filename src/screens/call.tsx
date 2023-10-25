import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallInfoTable } from "../components/calls/CallInfoTable";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";

import { useCall } from "../hooks/useCall";
import { useEvents } from "../hooks/useEvents";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { usePage } from "../hooks/usePage";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { useTab } from "../hooks/useTab";

export type CallPageParams = {
	id: string;
};

export const CallPage = () => {
	const { network } = useNetworkLoaderData();
	const { id } = useParams() as CallPageParams;

	const [tab, setTab] = useTab();
	const [page, setPage] = usePage();

	const call = useCall(network.name, { id_eq: id });

	const events = useEvents(network.name, { callId_eq: id }, {
		order: "id_ASC",
		page: tab === "events" ? page : 1
	});

	useDOMEventTrigger("data-loaded", !call.loading && !events.loading);

	return (
		<>
			<Card>
				<CardHeader>
					Call #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<CallInfoTable network={network} call={call} />
			</Card>
			{call.data &&
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
					</TabbedContent>
				</Card>
			}
		</>
	);
};
