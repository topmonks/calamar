import { Network } from "../../model/network";
import { simplifyExtrinsicId } from "../../services/extrinsicsService";

import { Link } from "../Link";

export interface ExtrinsicLinkProps {
	network: Network;
	id: string;
}

export const ExtrinsicLink = (props: ExtrinsicLinkProps) => {
	const {network, id} = props;

	const simplifiedId = simplifyExtrinsicId(id);

	return (
		<Link to={`/${network.name}/extrinsic/${simplifiedId}`}>
			{simplifiedId}
		</Link>
	);
};
