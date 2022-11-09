/** @jsxImportSource @emotion/react */
import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { CallsTable } from "../components/calls/CallsTable";
import EventsTable from "../components/events/EventsTable";
import { ExtrinsicInfoTable } from "../components/extrinsics/ExtrinsicInfoTable";
import { TabbedContent, TabPane } from "../components/TabbedContent";
import { useCalls } from "../hooks/useCalls";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsic } from "../hooks/useExtrinsic";

type ExtrinsicPageParams = {
	network: string;
	id: string;
};

function ExtrinsicPage() {
	const { network, id } = useParams() as ExtrinsicPageParams;

	const extrinsic = useExtrinsic(network, { id_eq: id });
	const events = useEvents(network, { extrinsic: { id_eq: id } }, "id_ASC");
	const calls = useCalls(network, { extrinsic: { id_eq: id } }, "id_ASC");

	return (
		<>
			<Card>
				<CardHeader>Extrinsic #{id}</CardHeader>
				<ExtrinsicInfoTable
					network={network}
					data={extrinsic.data}
					loading={extrinsic.loading}
				/>
			</Card>
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
					<TabPane
						label="Calls"
						count={calls.pagination.totalCount}
						loading={calls.loading}
						error={calls.error}
						value="calls"
					>
						<CallsTable network={network} {...calls} />
					</TabPane>
				</TabbedContent>
			</Card>
		</>
	);
}

export default ExtrinsicPage;
