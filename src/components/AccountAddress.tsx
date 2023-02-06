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
	prefix: number;
	icon?: boolean;
	link?: boolean;
	shorten?: boolean;
}

export const AccountAddress = (props: AccountLinkProps) => {
	const {
		network,
		address,
		prefix,
		icon = true,
		link = true,
		shorten
	} = props;

	const content = useMemo(() => {
		const encodedAddress = encodeAddress(address, prefix);
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

	if (!icon) {
		return <>{content}</>;
	}

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
