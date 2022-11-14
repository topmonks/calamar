import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallInfoTable } from "../components/calls/CallInfoTable";
import EventsTable from "../components/events/EventsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useCall } from "../hooks/useCall";
import { useEvents } from "../hooks/useEvents";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

type CallPageParams = {
	network: string;
	id: string;
};

export const CallPage: React.FC = () => {
	const { network, id } = useParams() as CallPageParams;

	const call = useCall(network, { id_eq: id });
	const events = useEvents(network, { call: { id_eq: id } }, "id_ASC");

	useDOMEventTrigger("data-loaded", !call.loading && !events.loading);

	return (
		<>
			<Card>
				<CardHeader style={{ paddingBottom: 48 }}>
					Call #{id}
				</CardHeader>
				<CallInfoTable network={network} {...call} />
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
							<EventsTable network={network} {...events} />
						</TabPane>
						<></>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
