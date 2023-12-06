/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Extrinsic } from "../../model/extrinsic";

import { ButtonLink } from "../ButtonLink";

const buttonStyle = css`
	margin: -4px 0;
`;

export interface ExtrinsicNameButtonProps {
	extrinsic: Extrinsic;
}

export const ExtrinsicNameButton = (props: ExtrinsicNameButtonProps) => {
	const {extrinsic} = props;

	return (
		<ButtonLink
			to={`/search/extrinsics?query=${extrinsic.palletName}.${extrinsic.callName}&network=${extrinsic.network.name}`}
			size="small"
			color="secondary"
			css={buttonStyle}
		>
			{extrinsic.palletName}.{extrinsic.callName}
		</ButtonLink>
	);
};
