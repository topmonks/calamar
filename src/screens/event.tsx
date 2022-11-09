import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useEvent } from "../hooks/useEvent";

type EventPageParams = {
	network: string;
	id: string;
};

export const EventPage: React.FC = () => {
	const { network, id } = useParams() as EventPageParams;

	const event = useEvent(network, id);

	return (<>
		<Card>
			<CardHeader style={{ paddingBottom: 48 }}>
				Event #{id}
			</CardHeader>
			<EventInfoTable network={network} {...event} />
		</Card>
	</>);
};
