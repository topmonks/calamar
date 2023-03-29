/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import { ButtonLink } from "../components/ButtonLink";
import { useNetworkGroups } from "../hooks/useNetworkGroups";

const containerStyle = css`
	width: 100%;
	height: 100vh;
	min-height: 1080px;
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
	top: 0;
	margin: 0;
	width: 100%;
	height: 100%;
	z-index: -1;
	background-color: #9af0f7;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		min-height: 1080px;
		max-height: 1200px;
		background-color: white;
		background-position: center bottom;
		background-size: contain;
		background-repeat: no-repeat;
		background-image: url(${Background});
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

const networksStyle = css`
	box-sizing: border-box;
	max-width: 1032px;
	margin: 0 auto;
	margin-top: 64px;
	margin-bottom: 48px;
	padding: 0 16px;
`;

const networksGroupStyle = (theme: Theme) => css`
	margin: 24px 0;
	padding: 16px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, auto));
	gap: 16px;

	${theme.breakpoints.up("md")} {
		padding: 16px;
	}
`;

const newtorkGroupTitleStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 18px;
	font-weight: 700;
	opacity: .75;

	div {
		font-size: 16px;
		font-weight: 400;
	}
`;

const networkButtonStyle = css`
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 16px;
	line-height: normal;

	font-size: 16px;
	font-weight: 400;
	text-decoration: none;

	color: inherit;
	background-color: #f5f5f5;
	border-radius: 8px;

	img {
		width: 32px;
		height: 32px;
		object-fit: contain;
		margin-right: 12px;
		margin-left: 4px;
	}

	&[data-network=polkadot],
	&[data-network=kusama] {
		grid-row-start: 2;
		grid-row-end: 4;
	}
`;

const footerStyle = css`
	flex: 0 0 auto;
	background-color: #9af0f7;

	> div {
		max-width: 900px;
	}
`;

export const HomePage = () => {
	const networkGroups = useNetworkGroups();

	return (
		<div css={containerStyle}>
			<div css={contentStyle}>
				<div css={backgroundStyle} data-test="background" />
				<Logo css={logoStyle} />
				<div css={subtitleStyle}>Block explorer for Polkadot & Kusama ecosystem</div>
				<div css={searchBoxStyle}>
					<SearchInput
						css={searchInputStyle}
						defaultNetwork={"polkadot"}
						persistNetwork
					/>
				</div>
				<div css={networksStyle}>
					{networkGroups.map((group) =>
						<Card css={networksGroupStyle} key={group.relayChainNetwork?.name || "other"}>
							<div css={newtorkGroupTitleStyle}>
								{group.relayChainNetwork?.displayName || "Other"}
								{group.relayChainNetwork && <div>and parachains</div>}
							</div>
							{group.networks.map(network =>
								network && (
									<ButtonLink to={`/${network.name}`} key={network.name} css={networkButtonStyle} data-network={network.name}>
										<img src={network.icon} />
										{network.displayName}
									</ButtonLink>
								)
							)}
						</Card>
					)}
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
