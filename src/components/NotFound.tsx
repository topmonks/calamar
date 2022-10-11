/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { css } from "@emotion/react";

const notFoundMessageStyle = css`
	padding: 16px 0;
	text-align: center;
	line-height: 54px;
`;

export type NotFoundProps = {
	message: string;
};

const NotFound = (props: PropsWithChildren) => {
	const { children } = props;

	return <div css={notFoundMessageStyle}>{children}</div>;
};

export default NotFound;
