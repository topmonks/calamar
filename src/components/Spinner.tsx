/** @jsxImportSource @emotion/react */
import { CircularProgress } from "@mui/material";
import { css } from "@emotion/react";

const spinnerStyle = css`
	color: #9af0f7;
`;

const Spinner = () => {
	return <CircularProgress css={spinnerStyle} size={54} thickness={6} />;
};

export default Spinner;
