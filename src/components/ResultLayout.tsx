/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";

import { getArchive } from "../services/archiveRegistryService";
import NotFoundPage from "../screens/notFound";

import SearchInput from "./SearchInput";
import { Link } from "./Link";
import { Card } from "./Card";
import { Footer } from "./Footer";

const containerStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
`;

const backgroundStyle = css`
	position: absolute;
	bottom: 0;
	left: 0;
	margin: 0;
	width: 100%;
	height: 100vh;
	background-position: center bottom;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(${Background});
	z-index: -1;
`;

const topBarStyle = (theme: Theme) => css`
	position: sticky;
	top: 0;
	padding: 16px;
	width: 100%;
	min-height: 130px;
	box-sizing: border-box;
	background-color: white;
	z-index: 1000;

	${theme.breakpoints.up("md")} {
		padding: 24px 32px;
		padding-bottom: 0;
	}
`;

const topBarContentStyle = (theme: Theme) => css`
	max-width: 1500px;
	margin: auto;
	display: flex;
	flex-direction: column;

	${theme.breakpoints.up("md")} {
		flex-direction: row;
		align-items: center;
	}
`;

const topBarRowStyle = css`
	display: flex;
	align-items: center;
	flex: 1 1 auto;
`;

const contentStyle = (theme: Theme) => css`
	position: relative;
	padding: 0 16px;
	padding-top: 40px;
	padding-bottom: 20px;
	width: 100%;
	box-sizing: border-box;
	flex: 1 1 auto;

	${theme.breakpoints.up("md")} {
		padding-left: 32px;
		padding-right: 32px;
	}
`;

const contentInnerStyle = css`
	max-width: 1500px;
	margin: auto;
`;

const logoStyle = (theme: Theme) => css`
	margin-right: auto;

	> svg {
		display: block;
		width: 250px;
	}

	${theme.breakpoints.down("md")} {
		margin-bottom: 12px;

		> svg {
			width: 160px;
		}
	}
`;

const searchInputStyle = css`
	width: 100%;
	flex: 1 1 auto;
`;

const footerStyle = css`
	background-color: #def9fb;

	> div {
		max-width: 1500px;
	}
`;

type ResultLayoutParams = {
	network: string;
};

function ResultLayout() {
	const { network: networkParam } = useParams() as ResultLayoutParams;

	const [network, setNetwork] = useState<string | undefined>();

	const networkIsValid = useMemo(
		() => Boolean(getArchive(networkParam)),
		[networkParam]
	);

	useEffect(() => {
		if (networkIsValid) {
			setNetwork(networkParam);
		}
	}, [networkParam, networkIsValid]);

	return (
		<div css={containerStyle}>
			<div css={topBarStyle} data-test="top-bar">
				<div css={topBarContentStyle}>
					<div css={topBarRowStyle}>
						<Link css={logoStyle} to="/">
							<Logo />
						</Link>
					</div>
					<div css={topBarRowStyle}>
						<SearchInput css={searchInputStyle} defaultNetwork={network} key={network} />
					</div>
				</div>
			</div>
			<div css={contentStyle}>
				<div css={backgroundStyle} data-test="background" />
				<div css={contentInnerStyle}>
					{networkIsValid && <Outlet />}
					{!networkIsValid && <NotFoundPage />}
				</div>
			</div>
			<Footer css={footerStyle} />
		</div>
	);
}

export default ResultLayout;
