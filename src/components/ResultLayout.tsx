/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { css, Theme } from "@emotion/react";

import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";

import { getArchive } from "../services/archiveRegistryService";
import NotFoundPage from "../screens/notFound";

import NetworkSelect from "./NetworkSelect";
import SearchInput from "./SearchInput";
import { Link } from "./Link";

const backgroundStyle = css`
	position: fixed;
	bottom: 0;
	margin: 0;
	width: 100%;
	height: 100vh;
	background-position: center bottom;
	background-size: contain;
	background-repeat: no-repeat;
	background-image: url(${Background});
`;

const topBarStyle = css`
	position: sticky;
	top: 0;
	padding: 16px;
	width: 100%;
	min-height: 130px;
	box-sizing: border-box;
	background-color: white;
	z-index: 1000;

	@media (min-width: 900px) {
		padding: 24px 32px;
		padding-bottom: 0;
	}
`;

const topBarContentStyle = css`
	max-width: 1500px;
	margin: auto;
	display: flex;
	flex-direction: column;

	@media (min-width: 900px) {
		flex-direction: row;
		align-items: center;
	}
`;

const topBarRowStyle = css`
	display: flex;
	align-items: center;
	flex: 1 1 auto;
`;

const contentStyle = css`
	position: relative;
	padding: 0 16px;
	padding-top: 40px;
	padding-bottom: 20px;
	width: 100%;
	box-sizing: border-box;

	@media (min-width: 900px) {
		padding-left: 32px;
		padding-right: 32px;
	}
`;

const contentInnerStyle = css`
	max-width: 1500px;
	margin: auto;
`;

const logoStyle = css`
	margin-right: auto;

	> svg {
		display: block;
		width: 160px;
	}

	@media (min-width: 900px) {
		> svg {
			width: 250px;
		}
	}
`;

const networkSelectStyle = (theme: Theme) => css`
	& .MuiInputBase-input {
		color: white;
		background-color: #61dafb;
		font-size: 16px;
		font-weight: 600;
	}

	& .MuiOutlinedInput-notchedOutline,
	&:hover .MuiOutlinedInput-notchedOutline,
	&.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: ${theme.palette.secondary.main};
	}

	@media (min-width: 900px) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
`;

const searchInputStyle = () => css`
	width: 100%;

	@media (min-width: 900px) {
		flex: 1 1 auto;

		.MuiInputBase-root {
			border-radius: 0px;
		}

		.MuiOutlinedInput-notchedOutline {
			border-left: none;
		}
	}
`;

type ResultLayoutParams = {
	network: string;
};

function ResultLayout() {
	const { network: networkParam } = useParams() as ResultLayoutParams;

	const [network, setNetwork] = useState<string | undefined>(networkParam);

	const networkIsValid = useMemo(
		() => Boolean(getArchive(networkParam)),
		[networkParam]
	);

	useEffect(() => {
		setNetwork(networkParam);
	}, [networkParam]);

	return (
		<>
			<div css={backgroundStyle} data-test="background" />
			<div css={topBarStyle} data-test="top-bar">
				<div css={topBarContentStyle}>
					<div css={topBarRowStyle}>
						<Link css={logoStyle} to="/">
							<Logo />
						</Link>
						<NetworkSelect css={networkSelectStyle} onChange={setNetwork} value={network} />
					</div>
					<div css={topBarRowStyle}>
						<SearchInput css={searchInputStyle} network={network} />
					</div>
				</div>
			</div>
			<div css={contentStyle}>
				<div css={contentInnerStyle}>
					{networkIsValid && <Outlet />}
					{!networkIsValid && <NotFoundPage />}
				</div>
			</div>
		</>
	);
}

export default ResultLayout;
