import { Network } from "../../model/network";
import { simplifyEventId } from "../../services/eventsService";

import { Link } from "../Link";

export interface EventLinkProps {
	network: Network;
	id: string;
}

export const EventLink = (props: EventLinkProps) => {
	const {network, id} = props;

	const simplifiedId = simplifyEventId(id);

	return (
		<Link to={`/${network.name}/event/${simplifiedId}`}>
			{simplifiedId}
		</Link>
	);
};
