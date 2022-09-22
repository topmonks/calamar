import React from "react";
import styled from "@emotion/styled";

import Spinner from "./Spinner";

const LoadingBox = styled.div`
	padding: 16px 0;
	text-align: center;
`;

const Loading = () => {
	return (
		<LoadingBox>
			<Spinner />
		</LoadingBox>
	);
};

export default Loading;
