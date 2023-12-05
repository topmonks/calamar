import { Event } from "../../model/event";

import { RuntimeMetadataButton } from "../runtime/RuntimeMetadataButton";

export interface EventRuntimeMetadataButtonProps {
	event: Event;
}

export const EventRuntimeMetadataButton = (props: EventRuntimeMetadataButtonProps) => {
	const {event} = props;

	if (!event.metadata.event) {
		return null;
	}

	return (
		<RuntimeMetadataButton
			title={`${event.palletName}.${event.eventName}`}
			description={event.metadata.event.description}
			link={`/${event.network.name}/runtime/${event.specVersion}/${event.palletName}/events/${event.eventName}`}
		/>
	);
};
