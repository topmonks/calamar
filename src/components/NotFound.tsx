import React, { PropsWithChildren } from "react";
import styled from "@emotion/styled";

const MessageBox = styled.div`
	padding: 16px 0;
	text-align: center;
	line-height: 54px;
`;

export type NotFoundProps = {
	message: string;
};

const NotFound = (props: PropsWithChildren) => {
	const { children } = props;

	return <MessageBox>{children}</MessageBox>;
};

export default NotFound;
