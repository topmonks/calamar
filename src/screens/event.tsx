import { useParams } from "react-router-dom";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import { EventInfoTable } from "../components/events/EventInfoTable";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";
import { useEvent } from "../hooks/useEvent";
import { useNetworkLoaderData } from "../hooks/useNetworkLoaderData";

export type EventPageParams = {
	id: string;
};

export const EventPage = () => {
	const { network } = useNetworkLoaderData();
	const { id } = useParams() as EventPageParams;

	const event = useEvent(network.name, { simplifiedId: id });

	useDOMEventTrigger("data-loaded", !event.loading);

	return (
		<Card data-test="item-info">
			<CardHeader data-test="item-header">
				Event #{id}
				<CopyToClipboardButton value={id} />
			</CardHeader>
			<EventInfoTable network={network} event={event} />
		</Card>
	);
};
