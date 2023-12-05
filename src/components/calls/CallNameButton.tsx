/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Call } from "../../model/call";

import { ButtonLink } from "../ButtonLink";

const buttonStyle = css`
	margin: -4px 0;
`;

export interface CallNameButtonProps {
	call: Call;
}

export const CallNameButton = (props: CallNameButtonProps) => {
	const {call} = props;

	return (
		<ButtonLink
			to={`/search/extrinsics?query=${call.palletName}.${call.callName}&network=${call.network.name}`}
			size="small"
			color="secondary"
			css={buttonStyle}
		>
			{call.palletName}.{call.callName}
		</ButtonLink>
	);
};
