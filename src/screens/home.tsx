/** @jsxImportSource @emotion/react */
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import SearchInput from "../components/SearchInput";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import { ButtonLink } from "../components/ButtonLink";

import { useNetworkGroups } from "../hooks/useNetworkGroups";
import { useNetworks } from "../hooks/useNetworks";

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
		&.MuiOutlinedInput-root .MuiAutocomplete-input {
			padding: 16px 24px;
		}
	}

	${theme.breakpoints.up("md")} {
		[data-class="search-button"] {
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

	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	justify-content: center;
`;

const networkStyle = (theme: Theme) => css`
	margin: 0;
	padding: 8px;

	width: 100%;

	${theme.breakpoints.up("sm")} {
		width: 230px;
	}

	${theme.breakpoints.up("md")} {
		padding: 8px;
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
`;

const footerStyle = css`
	flex: 0 0 auto;

	> div {
		max-width: 1000px;
	}
`;

export const HomePage = () => {
	const networks = useNetworks();

	return (
		<div css={containerStyle}>
			<div css={backgroundStyle} data-test="background" />
			<div css={contentStyle}>
				<Logo css={logoStyle} />
				<div css={subtitleStyle}>Block explorer for Polkadot & Kusama ecosystem</div>
				<div css={searchBoxStyle}>
					<SearchInput
						css={searchInputStyle}
						persist
					/>
				</div>
				<div css={networksStyle} data-test="networks">
					{networks.map((network) =>
						<Card css={networkStyle} key={network.name}>
							<ButtonLink to={`/${network.name}`} key={network.name} css={networkButtonStyle} data-network={network.name}>
								<img src={network.icon} />
								{network.displayName}
							</ButtonLink>
						</Card>
					)}
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
};
