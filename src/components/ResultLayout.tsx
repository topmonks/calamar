/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import styled from "@emotion/styled";

import Background from "../assets/detail-page-bgr.svg";
import { ReactComponent as Logo } from "../assets/calamar-logo-export-02.svg";

import { getArchive } from "../services/archivesService";
import NotFoundPage from "../screens/notFound";

import NetworkSelect from "./NetworkSelect";
import SearchInput from "./SearchInput";
import { css, Theme } from "@emotion/react";

const StyledTopBar = styled.div`
	position: fixed;
	top: 0;
	padding: 16px;
	width: 100%;
	min-height: 130px;
	box-sizing: border-box;
	background-color: white;
	z-index: 1000;

	> .top-bar-content {
		max-width: 1500px;
		margin: auto;
		display: flex;
		flex-direction: column;

		> .top-bar-first-row,
		> .top-bar-second-row {
			flex: 1 1 auto;
		}

		> .top-bar-first-row {
			display: flex;
			align-items: center;
		}
	}

	.logo {
		margin-right: auto;

		> svg {
			width: 160px;
		}
	}

	@media (min-width: 900px) {
		padding: 24px 32px;
		padding-bottom: 0;

		> .top-bar-content {
			flex-direction: row;
			align-items: center;
		}

		.logo {
			> svg {
				width: 250px;
			}
		}
	}
`;

const StyledContent = styled.div`
	position: absolute;
	top: 170px;
	padding: 0 16px;
	width: 100%;
	box-sizing: border-box;

	@media (min-width: 900px) {
		padding: 0 32px;
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

	console.log("NNN", network);

	return (
		<>
			<div
				style={{
					width: "100vw",
					height: "100vh",
					backgroundPosition: "center bottom",
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundImage: `url(${Background})`,
					margin: 0,
					position: "fixed",
				}}
			/>
			<StyledContent>
				<div style={{ maxWidth: "1500px", margin: "auto" }}>
					{networkIsValid && <Outlet />}
					{!networkIsValid && <NotFoundPage />}
				</div>
			</StyledContent>
			<StyledTopBar>
				<div className="top-bar-content">
					<div className="top-bar-first-row">
						<Link className="logo" to="/">
							<Logo />
						</Link>
						<NetworkSelect css={networkSelectStyle} onChange={setNetwork} value={network} />
					</div>
					<div className="top-bar-second-row">
						<SearchInput css={searchInputStyle} network={network} />
					</div>
				</div>
			</StyledTopBar>
		</>
	);
}

export default ResultLayout;
