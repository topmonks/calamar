import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useEvent } from "../hooks/useEvent";
import { useRuntimeSpecs } from "../hooks/useRuntimeSpecs";

type EventPageParams = {
	network: string;
	id: string;
};

export const EventPage: React.FC = () => {
	const { network, id } = useParams() as EventPageParams;

	const event = useEvent(network, { id_eq: id });

	const specVersion = event.data?.block.spec.specVersion;
	const runtimeSpecs = useRuntimeSpecs(network, specVersion ? [specVersion] : [], {
		waitUntil: event.loading
	});

	useDOMEventTrigger("data-loaded", !event.loading && !runtimeSpecs.loading);

	return (<>
		<Card>
			<CardHeader>
				Event #{id}
				<CopyToClipboardButton value={id} />
			</CardHeader>
			<EventInfoTable network={network} event={event} runtimeSpecs={runtimeSpecs} />
		</Card>
	</>);
};
