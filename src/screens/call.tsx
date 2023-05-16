import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallInfoTable } from "../components/calls/CallInfoTable";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useCall } from "../hooks/useCall";
import { useEvents } from "../hooks/useEvents";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useRootLoaderData } from "../hooks/useRootLoaderData";

export type CallPageParams = {
	id: string;
};

export const CallPage = () => {
	const { network } = useRootLoaderData();
	const { id } = useParams() as CallPageParams;

	const call = useCall(network.name, { id_eq: id });
	const events = useEvents(network.name, { callId_eq: id }, "id_ASC");

	useDOMEventTrigger("data-loaded", !call.loading && !events.loading);

	return (
		<>
			<Card>
				<CardHeader>
					Call #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<CallInfoTable network={network.name} call={call} />
			</Card>
			{call.data &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable network={network.name} events={events} />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
