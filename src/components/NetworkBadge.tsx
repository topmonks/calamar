/** @jsxImportSource @emotion/react */
import { HTMLAttributes } from "react";
import { css } from "@emotion/react";

import { Network } from "../model/network";

const networkStyle = css`
	display: flex;
	align-items: center;

	white-space: nowrap;
`;

const networkIconStyle = css`
	width: 20px;
	height: 20px;
	object-fit: contain;
	margin-right: 12px;
	flex: 0 0 auto;
`;

export interface NetworkBadgeProps extends HTMLAttributes<HTMLDivElement> {
	network: Network;
}

export const NetworkBadge = (props: NetworkBadgeProps) => {
	const {network, ...divProps} = props;

	return (
		<div {...divProps} css={networkStyle}>
			<img src={network.icon} css={networkIconStyle} />
			<div>{network.displayName}</div>
		</div>
	);
};
