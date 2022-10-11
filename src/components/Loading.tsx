/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Spinner from "./Spinner";

const loadingStyle = css`
	padding: 16px 0;
	text-align: center;
`;

const Loading = () => {
	return (
		<div css={loadingStyle}>
			<Spinner />
		</div>
	);
};

export default Loading;
