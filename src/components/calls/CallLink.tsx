import { Network } from "../../model/network";
import { simplifyCallId } from "../../services/callsService";

import { Link } from "../Link";

export interface CallLinkProps {
	network: Network;
	id: string;
}

export const CallLink = (props: CallLinkProps) => {
	const {network, id} = props;

	const simplifiedId = simplifyCallId(id);

	return (
		<Link to={`/${network.name}/call/${simplifiedId}`}>
			{simplifiedId}
		</Link>
	);
};
