import { Network } from "../../model/network";
import { simplifyBlockId } from "../../services/blocksService";

import { Link } from "../Link";

export interface BlockLinkProps {
	network: Network;
	id: string;
}

export const BlockLink = (props: BlockLinkProps) => {
	const {network, id} = props;

	const simplifiedId = simplifyBlockId(id);

	return (
		<Link to={`/${network.name}/block/${simplifiedId}`}>
			{simplifiedId}
		</Link>
	);
};
