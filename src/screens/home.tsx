/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import { Link } from "../components/Link";
import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { Devtool } from "../components/Devtool";

const containerStyle = css`
	width: 100vw;
	height: 100vh;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;
`;

const contentStyle = css`
	position: relative;
	flex: 1 1 auto;
`;

const backgroundStyle = css`
	position: absolute;
	bottom: 0;
	margin: 0;
	width: 100%;
	height: 100vh;
	background-position: center bottom;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(${Background});
	z-index: -1;
`;

const logoStyle = css`
	width: 500px;
	margin: auto;
	display: block;
	max-width: 100%;
`;

const searchBoxStyle = css`
	display: flex;
	margin: auto;
	max-width: 1000px;
	padding-left: 16px;
	padding-right: 16px;
	text-align: center;
	justify-content: center;
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

const footerStyle = css`
	background-color: #9af0f7;

	> div {
		max-width: 900px;
	}
`;

function HomePage() {
	const [network, setNetwork] = useState<string | undefined>();

	return (
		<div css={containerStyle}>
			<div css={contentStyle}>
				<div css={backgroundStyle} data-test="background" />
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
					<div><Devtool><Link to={`/${network}/runtime`}>Runtime specs</Link></Devtool></div>
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
}

export default HomePage;
