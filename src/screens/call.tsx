import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallInfoTable } from "../components/calls/CallInfoTable";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import EventsTable from "../components/events/EventsTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useCall } from "../hooks/useCall";
import { useEvents } from "../hooks/useEvents";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useRuntimeSpecs } from "../hooks/useRuntimeSpecs";

type CallPageParams = {
	network: string;
	id: string;
};

export const CallPage: React.FC = () => {
	const { network, id } = useParams() as CallPageParams;

	const call = useCall(network, { id_eq: id });
	const events = useEvents(network, { call: { id_eq: id } }, "id_ASC");

	const specVersion = call.data?.block.spec.specVersion;
	const runtimeSpecs = useRuntimeSpecs(network, specVersion ? [specVersion] : [], {
		waitUntil: call.loading
	});


	useDOMEventTrigger("data-loaded", !call.loading && !events.loading && !runtimeSpecs.loading);

	return (
		<>
			<Card>
				<CardHeader>
					Call #{id}
					<CopyToClipboardButton value={id} />
				</CardHeader>
				<CallInfoTable network={network} call={call} runtimeSpecs={runtimeSpecs} />
			</Card>
			{call.data && !runtimeSpecs.loading &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable network={network} events={events} runtimeSpecs={runtimeSpecs} />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
};
