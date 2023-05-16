/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getNetwork } from "../services/networksService";

const iconStyle = css`
	cursor: default !important;
    vertical-align: text-bottom;
	margin-right: 8px;
    height: 32px;
`;

export type ChainIconProps = {
	networkName: string;
}

export const ChainIcon = (props: ChainIconProps) => {
	const {networkName} = props;

	const network = getNetwork(networkName);

	if (!network) {
		return null;
	}

	return (
		<img
			css={iconStyle}
			src={network.icon}
		/>
	);
};
