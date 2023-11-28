/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

import { Network } from "../model/network";
import { getNetworks } from "../services/networksService";

import { NetworkSelect } from "./NetworkSelect";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

const networkSelectStyle = (theme: Theme) => css`
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;

	&, &:hover, &.Mui-focused {
		.MuiOutlinedInput-notchedOutline {
			border-color: #c4cdd5;
			border-right: none;
		}
	}

	&::after {
		position: absolute;
		right: 0;
		content: '';
		display: block;
		width: 1px;
		height: 24px;
		background-color: #c4cdd5;
		z-index: 10;
	}

	${theme.breakpoints.down("sm")} {
		.MuiListItemIcon-root {
			min-width: 0;
		}

		.MuiListItemText-root {
			display: none;
		}
	}
`;

const textFieldStyle = css`
	.MuiInputBase-root {
		border-radius: 0;

		.MuiOutlinedInput-notchedOutline {
			border-left: none;
		}

		&, &:hover, &.Mui-focused {
			.MuiOutlinedInput-notchedOutline {
				border-color: #c4cdd5;
				border-right: none;
			}
		}
	}
`;

const buttonStyle = (theme: Theme) => css`
	border-radius: 8px;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
	border: 1px solid ${theme.palette.primary.dark};

	.MuiButton-startIcon {
		display: none;
		margin: 0;

		svg {
			font-size: 28px;
		}
	}

	${theme.breakpoints.down("md")} {
		padding-left: 16px;
		padding-right: 16px;

		.text {
			display: none;
		}

		.MuiButton-startIcon {
			display: flex;
		}
	}
`;

export type SearchInputProps = FormHTMLAttributes<HTMLFormElement> & {
	persist?: boolean;
	defaultNetworks?: Network[];
};

function SearchInput(props: SearchInputProps) {
	const { persist, defaultNetworks, ...restProps } = props;

	const [qs] = useSearchParams();

	const [networks, setNetworks] = useState<Network[]>(defaultNetworks || getNetworks(qs.getAll("network") || []));
	const [query, setQuery] = useState<string>(qs.get("query") || "");

	const navigate = useNavigate();

	const storeNetworks = (networks: Network[]) => localStorage.setItem("networks", JSON.stringify(networks.map(it => it.name)));
	const loadNetworks = () => getNetworks(JSON.parse(localStorage.getItem("networks") || "[]"));

	const handleNetworkSelect = useCallback((networks: Network[], isUserAction: boolean) => {
		if (isUserAction && persist) {
			console.log("store", networks);
			storeNetworks(networks);
		}

		setNetworks(networks);
	}, [persist]);

	const handleSubmit = useCallback((ev: any) => {
		ev.preventDefault();

		if (networks.length > 0) {
			storeNetworks(networks);
		}

		const searchParams = new URLSearchParams({
			query: query
		});

		for (const network of networks) {
			searchParams.append("network", network.name);
		}

		console.log("SEARCH", `/search?${searchParams.toString()}`);

		navigate(`/search?${searchParams.toString()}`);
	}, [navigate, networks, query]);

	useEffect(() => {
		setQuery(qs.get("query") || "");
		setNetworks(defaultNetworks || getNetworks(qs.getAll("network") || []));
	}, [qs, defaultNetworks]);

	useEffect(() => {
		if (persist) {
			setNetworks(loadNetworks());
		}
	}, [persist]);

	return (
		<form {...restProps} onSubmit={handleSubmit}>
			<FormGroup row css={formGroupStyle}>
				<NetworkSelect
					css={networkSelectStyle}
					onChange={handleNetworkSelect}
					value={networks}
				/>
				<TextField
					css={textFieldStyle}
					fullWidth
					id="search"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
					value={query}
				/>
				<Button
					css={buttonStyle}
					onClick={handleSubmit}
					startIcon={<SearchIcon />}
					type="submit"
					variant="contained"
					color="primary"
					data-class="search-button"
				>
					<span className="text">Search</span>
				</Button>
			</FormGroup>
		</form>
	);
}

export default SearchInput;
