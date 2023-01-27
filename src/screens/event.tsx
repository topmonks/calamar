import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useEvent } from "../hooks/useEvent";

type EventPageParams = {
	network: string;
	id: string;
};

export const EventPage: React.FC = () => {
	const { network, id } = useParams() as EventPageParams;

	const event = useEvent(network, { id_eq: id });

	useDOMEventTrigger("data-loaded", !event.loading);

	return (<>
		<Card>
			<CardHeader>
				Event #{id}
				<CopyToClipboardButton value={id} />
			</CardHeader>
			<EventInfoTable network={network} event={event} />
		</Card>
	</>);
};
