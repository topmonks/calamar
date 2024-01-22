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
				On January 31, Calamar and its data sources will go into self-hosted only mode.<br />
				This is following the deprecation of Firesquid archives and its resulting effect on Giant Squid.<br />
				We apologize for any inconvenience.<br />
				<Link to="https://github.com/topmonks/calamar/blob/master/README.md">Read more</Link>
			</div>
			<Outlet />
		</>
	);
};
