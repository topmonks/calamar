/** @jsxImportSource @emotion/react */
import { LinearProgress } from "@mui/material";
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import { Footer } from "./Footer";

import { usePreloadRuntimeMetadata } from "../hooks/usePreloadRuntimeMetadata";
import { Outlet } from "react-router-dom";

const containerStyle = (theme: Theme) => css`
	--content-min-height: 900px;

	width: 100%;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: stretch;

	${theme.breakpoints.up("sm")} {
		--content-min-height: 1000px;
	}

	${theme.breakpoints.up("md")} {
		--content-min-height: 1100px;
	}

	${theme.breakpoints.up("lg")} {
		--content-min-height: 1200px;
	}

	${theme.breakpoints.up("xl")} {
		--content-min-height: 1300px;
	}
`;

const contentStyle = css`
	position: relative;
	flex: 1 1 auto;
	min-height: var(--content-min-height);
`;

const backgroundStyle = css`
	position: absolute;
	top: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	min-height: 100vh;
	z-index: -1;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: var(--content-min-height);
		background-color: white;
		background-position: center bottom;
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-image: url(${Background});
	}

	&::after {
		content: '';
		position: absolute;
		top: var(--content-min-height);
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #9af0f7;
	}
`;

const logoStyle = css`
	width: 420px;
	margin: 40px auto;
	display: block;
	max-width: 100%;
`;

const subtitleStyle = (theme: Theme) => css`
	position: relative;
	top: -100px;
	padding: 0 16px;
	font-size: 16px;
	text-align: center;

	${theme.breakpoints.down("sm")} {
		top: -70px;
	}
`;

const footerStyle = css`
	flex: 0 0 auto;

	> div {
		max-width: 1000px;
	}
`;

const metadatLoadingStyle = css`
	max-width: 500px;
	margin: 0 auto;
	padding: 0 16px;

	text-align: center;
`;

const metadataProgressStyle = css`
	margin-bottom: 16px;
	height: 8px;

	border-radius: 4px;
	background-color: #e1fbfd;

	.MuiLinearProgress-bar {
		background-color: #7acbdd;
	}
`;

export const RuntimeMetadataLoader = () => {
	const metadataPreload = usePreloadRuntimeMetadata();

	if (metadataPreload.loading) {
		return (
			<div css={containerStyle}>
				<div css={backgroundStyle} data-test="background" />
				<div css={contentStyle}>
					<Logo css={logoStyle} />
					<div css={subtitleStyle}>Block explorer for Polkadot & Kusama ecosystem</div>
					<div css={metadatLoadingStyle}>
						<LinearProgress
							css={metadataProgressStyle}
							variant="determinate"
							value={metadataPreload.progress}
						/>
						<span>Loading latest runtime metadata ...</span>
					</div>
				</div>
				<Footer css={footerStyle} />
			</div>
		);
	}

	return <Outlet />;
};
