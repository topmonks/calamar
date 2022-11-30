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
import { useRuntimeSpecs } from "../hooks/useRuntimeSpecs";

type ExtrinsicPageParams = {
	network: string;
	id: string;
};

function ExtrinsicPage() {
	const { network, id } = useParams() as ExtrinsicPageParams;

	const extrinsic = useExtrinsic(network, { id_eq: id });
	const events = useEvents(network, { extrinsic: { id_eq: id } }, "id_ASC");
	const calls = useCalls(network, { extrinsic: { id_eq: id } }, "id_ASC");

	const specVersion = extrinsic.data?.block.spec.specVersion;
	const runtimeSpecs = useRuntimeSpecs(network, specVersion ? [specVersion] : [], {
		waitUntil: extrinsic.loading
	});

	useDOMEventTrigger("data-loaded", !extrinsic.loading && !events.loading && !calls.loading && !runtimeSpecs.loading);

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
					runtimeSpecs={runtimeSpecs}
				/>
			</Card>
			{extrinsic.data && !runtimeSpecs.loading &&
				<Card>
					<TabbedContent>
						<TabPane
							label="Events"
							count={events.pagination.totalCount}
							loading={events.loading}
							error={events.error}
							value="events"
						>
							<EventsTable
								network={network}
								events={events}
								runtimeSpecs={runtimeSpecs}
							/>
						</TabPane>
						<TabPane
							label="Calls"
							count={calls.pagination.totalCount}
							loading={calls.loading}
							error={calls.error}
							value="calls"
						>
							<CallsTable network={network} calls={calls} />
						</TabPane>
					</TabbedContent>
				</Card>
			}
		</>
	);
}

export default ExtrinsicPage;
