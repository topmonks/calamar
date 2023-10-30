/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Spinner from "./Spinner";
import { HTMLAttributes } from "react";

const loadingStyle = css`
	display: flex;
	align-items: center;
	justify-content: center;
`;

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {}

const Loading = (props: LoadingProps) => {
	return (
		<div {...props} css={loadingStyle}>
			<Spinner />
		</div>
	);
};

export default Loading;
