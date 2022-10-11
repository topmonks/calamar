/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from "react";
import { css, Theme } from "@emotion/react";

import { ReactComponent as Logo } from "../assets/calamar-logo-export-05.svg";
import Background from "../assets/main-screen-bgr.svg";

import { Link } from "../components/Link";
import NetworkSelect from "../components/NetworkSelect";
import SearchInput from "../components/SearchInput";

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

const searchBoxStyle = css`
	margin: auto;
	max-width: 1000px;
	padding-left: 16px;
	padding-right: 16px;
	text-align: center;

	@media (min-width: 900px) {
		display: flex;
		justify-content: center;
	}
`;

const networkSelectStyle = (theme: Theme) => css`
	margin-bottom: 16px;

	& .MuiInputBase-input {
		color: white;
		background-color: #61dafb;
		font-size: 16px;
		font-weight: 600;

		&.MuiSelect-select {
			padding: 16px 24px;
		}
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

const searchInputStyle = css`
	.MuiInputBase-input {
		padding: 16px 24px;
	}

	@media (min-width: 900px) {
		flex: 1 1 auto;

		.MuiButton-root {
			padding-left: 52px;
			padding-right: 52px;
		}

		.MuiInputBase-root {
			border-radius: 0px;
		}

		.MuiOutlinedInput-notchedOutline {
			border-left: none;
		}
	}
`;

function HomePage() {
	const [network, setNetwork] = useState<string | undefined>();

	const handleNetworkSelect = useCallback(
		(network: string, isUserAction: boolean) => {
			if (isUserAction) {
				localStorage.setItem("network", network);
			}

			setNetwork(network);
		},
		[]
	);

	useEffect(() => {
		const network = localStorage.getItem("network");
		network && setNetwork(network);
	}, []);

	return (
		<div css={containerStyle}>
			<Logo css={logoStyle} />
			<div css={searchBoxStyle}>
				<NetworkSelect css={networkSelectStyle} onChange={handleNetworkSelect} value={network} />
				<SearchInput css={searchInputStyle} network={network} />
			</div>
			<div style={{ margin: "auto", width: "fit-content", marginTop: 24 }}>
				<Link to={`/${network}/latest-extrinsics`}>Show latest extrinsics</Link>
			</div>
		</div>
	);
}

export default HomePage;
