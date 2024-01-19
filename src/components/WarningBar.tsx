/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Outlet } from "react-router-dom";
import { Link } from "./Link";

const barStyle = css`
	background-color: rgb(237, 108, 2);
	color: white;
	text-align: center;
	font-size: 16px;
	padding: 10px;

	a {
		color: white;
		text-decoration: underline;
	}
`;

export const WarningBar = () => {
	return (
		<>
			<div css={barStyle}>
				On January 31, Calamar and its datasources will become into <strong>self-hosted only mode</strong>.<br />
				It is a reaction on recent event from Subsquid that Firesquid Archives and GiantSquid are being <strong>shut down</strong>.<br />
				We appologize for any inconvenience.<br />
				<Link to="#">Read more</Link>
			</div>
			<Outlet />
		</>
	);
};
