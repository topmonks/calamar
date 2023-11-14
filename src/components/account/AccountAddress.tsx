/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { encodeAddress } from "../../utils/address";
import { shortenHash } from "../../utils/shortenHash";

import CopyToClipboardButton, { CopyToClipboardButtonProps } from "../CopyToClipboardButton";
import { Link } from "../Link";

import { AccountAvatar } from "./AccountAvatar";

const accountAddressStyle = css`
	display: flex;
	align-items: center;
`;

const iconStyle = css`
	margin-right: 8px;
`;

const copyToClipboardStyle = css`
	margin-left: 8px;
`;

export type AccountLinkProps = {
	network: Network;
	address: string;
	icon?: boolean;
	link?: boolean;
	shorten?: boolean;
	copyToClipboard?: CopyToClipboardButtonProps["size"];
}

export const AccountAddress = (props: AccountLinkProps) => {
	const {
		network,
		address,
		icon = true,
		link = true,
		shorten,
		copyToClipboard
	} = props;

	const encodedAddress = useMemo(() => encodeAddress(address, network.prefix), [address]);

	const content = useMemo(() => {
		let content = <span>{shorten ? shortenHash(encodedAddress) : encodedAddress}</span>;

		if (link) {
			content = (
				<Link to={`/${network.name}/account/${address}`}>
					{content}
				</Link>
			);
		}

		if (shorten) {
			content = (
				<Tooltip
					arrow
					placement="top"
					enterTouchDelay={0}
					title={encodedAddress}
				>
					{content}
				</Tooltip>
			);
		}

		return content;
	}, [network, address, encodeAddress, link]);

	return (
		<div css={accountAddressStyle}>
			{icon && (
				<AccountAvatar
					css={iconStyle}
					address={address}
					prefix={network.prefix}
					size={20}
				/>
			)}
			{content}
			{copyToClipboard && (
				<CopyToClipboardButton
					css={copyToClipboardStyle}
					value={encodedAddress}
					size={copyToClipboard}
				/>
			)}
		</div>
	);
};
