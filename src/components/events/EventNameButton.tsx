/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Event } from "../../model/event";

import { ButtonLink } from "../ButtonLink";

const buttonStyle = css`
	margin: -4px 0;
`;

export interface EventNameButtonProps {
	event: Event;
}

export const EventNameButton = (props: EventNameButtonProps) => {
	const {event} = props;

	return (
		<ButtonLink
			to={`/search/events?query=${event.palletName}.${event.eventName}&network=${event.network.name}`}
			size="small"
			color="secondary"
			css={buttonStyle}
		>
			{event.palletName}.{event.eventName}
		</ButtonLink>
	);
};
