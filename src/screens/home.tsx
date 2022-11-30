/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import { Link } from "../components/Link";
import NetworkSelect from "../components/NetworkSelect";
import SearchInput from "../components/SearchInput";
import { DevtoolsIcon } from "../components/DevtoolsIcon";

const containerStyle = css`
	width: 100vw;
	height: 100vh;
	background-position: center bottom;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(${Background});
	margin: 0;
`;

const logoStyle = css`
	width: 500px;
	margin: auto;
	display: block;
	max-width: 100%;
`;

const searchBoxStyle = (theme: Theme) => css`
	display: flex;
	margin: auto;
	max-width: 1000px;
	padding-left: 16px;
	padding-right: 16px;
	text-align: center;
	justify-content: center;
`;

const networkSelectStyle = (theme: Theme) => css`
	margin-bottom: 16px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;

	& .MuiInputBase-input {
		//color: white;
		//background-color: #61dafb;
		font-size: 16px;
		font-weight: 600;

		&.MuiSelect-select {
			padding: 16px 24px;
		}
	}

	& .MuiOutlinedInput-notchedOutline,
	&:hover .MuiOutlinedInput-notchedOutline,
	&.Mui-focused .MuiOutlinedInput-notchedOutline {
		//border-color: ${theme.palette.secondary.main};
		border-color: #c4cdd5;
		border-right: none;
	}

	&::after {
		content: '';
		display: block;
		width: 1px;
		height: 24px;
		margin-left: -1px;
		background-color: #c4cdd5;
		position: relative;
		z-index: 10;
	}
`;

const searchInputStyle = (theme: Theme) => css`
	flex: 1 1 auto;

	.MuiInputBase-root {
		.MuiInputBase-input,
		.MuiSelect-select {
			padding: 16px 24px;
		}
	}

	${theme.breakpoints.up("md")} {
		.MuiButton-root {
			padding-left: 52px;
			padding-right: 52px;
		}
	}
`;

function HomePage() {
	const [network, setNetwork] = useState<string | undefined>();

	return (
		<div css={containerStyle}>
			<Logo css={logoStyle} />
			<div css={searchBoxStyle}>
				<SearchInput
					css={searchInputStyle}
					defaultNetwork={"polkadot"}
					onNetworkChange={setNetwork}
					persistNetwork
				/>
			</div>
			<div style={{ margin: "auto", width: "fit-content", marginTop: 24, textAlign: "center" }}>
				<div><Link to={`/${network}/latest-extrinsics`}>Show latest extrinsics</Link></div>
				<div><DevtoolsIcon><Link to={`/${network}/runtime`}>Runtime specs</Link></DevtoolsIcon></div>
			</div>
		</div>
	);
}

export default HomePage;
