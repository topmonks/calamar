/** @jsxImportSource @emotion/react */
import { ReactNode, useMemo } from "react";
import { Chip } from "@mui/material";

import { encodeAddress } from "../utils/formatAddress";
import { shortenHash } from "../utils/shortenHash";

import { Link } from "./Link";
import { AccountAvatar } from "./AccountAvatar";

export type AccountLinkProps = {
	network: string;
	address: string;
	prefix?: number;
	link?: boolean;
	shorten?: boolean;
}

export const AccountAddress = (props: AccountLinkProps) => {
	const {
		network,
		address,
		prefix,
		link = true,
		shorten
	} = props;

	const content = useMemo(() => {
		const encodedAddress = encodeAddress(network, address, prefix);
		const content: ReactNode = shorten ? shortenHash(encodedAddress) : encodedAddress;

		if (link) {
			return (
				<Link to={`/${network}/account/${address}`}>
					{content}
				</Link>
			);
		}

		return content;
	}, [network, address, link]);

	return (
		<>
			<Chip
				variant="outlined"
				icon={<AccountAvatar address={address} prefix={prefix} size={20} />}
				label={content}
			/>
		</>
	);
};
