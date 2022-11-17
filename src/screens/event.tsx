import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useEvent } from "../hooks/useEvent";
import { shortenId } from "../utils/shortenId";

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
			<CardHeader style={{ paddingBottom: 48 }}>
				Event #{shortenId(id)}
			</CardHeader>
			<EventInfoTable network={network} {...event} />
		</Card>
	</>);
};
