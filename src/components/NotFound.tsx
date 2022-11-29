/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { css } from "@emotion/react";

const notFoundMessageStyle = css`
	padding: 16px 0;
	text-align: center;
`;

export type NotFoundProps = {
	message: string;
};

const NotFound = (props: PropsWithChildren) => {
	const { children } = props;

	return <div css={notFoundMessageStyle} data-test="not-found">{children}</div>;
};

export default NotFound;
