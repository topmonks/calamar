/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Autocomplete, Button, FormGroup, TextField, debounce } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

import { useAutocompleteSearchQuery } from "../hooks/useAutocompleteSearchQuery";
import { Network } from "../model/network";
import { getNetworks } from "../services/networksService";

import { NetworkSelect } from "./NetworkSelect";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

const networkSelectStyle = (theme: Theme) => css`
	flex: 0 0 auto;

	border-top-right-radius: 0;
	border-bottom-right-radius: 0;

	border-right: none;

	&, &:hover, &.Mui-focused {
		.MuiOutlinedInput-notchedOutline {
			border-color: #bdbdbd;
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
		background-color: #bdbdbd;
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

const inputStyle = css`
	flex: 1 0 auto;

	.MuiOutlinedInput-root {
		padding: 0 !important;

		.MuiAutocomplete-input {
			padding: 12px 16px;
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
				border-color: #bdbdbd;
				border-right: none;
			}
		}
	}
`;

const autocompleteNameStyle = css`
	flex: 1 1 auto;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-right: 16px;
	font-size: 14px;
`;

const autocompleteTypeStyle = css`
	margin-left: auto;
	flex: 0 0 auto;
	font-size: 12px;
	opacity: .75;
	border: solid 1px gray;
	border-radius: 8px;
	padding: 0 4px;
	background-color: rgba(0, 0, 0, .025);
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

function storeNetworks(networks: Network[]) {
	localStorage.setItem("networks", JSON.stringify(networks.map(it => it.name)));
}

function loadNetworks() {
	return getNetworks(JSON.parse(localStorage.getItem("networks") || "[]"));
}

export type SearchInputProps = FormHTMLAttributes<HTMLFormElement> & {
	persist?: boolean;
	defaultNetworks?: Network[];
};

function SearchInput(props: SearchInputProps) {
	const { persist, defaultNetworks, ...restProps } = props;

	const [qs] = useSearchParams();

	const navigate = useNavigate();

	const [networks, setNetworks] = useState<Network[]>(defaultNetworks || getNetworks(qs.getAll("network") || []));
	const [query, setQuery] = useState<string>(qs.get("query") || "");
	const [autocompleteQuery, _setAutocompleteQuery] = useState<string>(query || "");

	const setAutocompleteQuery = useMemo(() => debounce(_setAutocompleteQuery, 250), []);

	const autocompleteSuggestions = useAutocompleteSearchQuery(autocompleteQuery, networks);

	const handleNetworkSelect = useCallback((networks: Network[], isUserAction: boolean) => {
		if (isUserAction && persist) {
			console.log("store", networks);
			storeNetworks(networks);
		}

		setNetworks(networks);
	}, [persist]);

	const handleQueryChange = useCallback((ev: any, value: string) => {
		setQuery(value);
		setAutocompleteQuery(value);
	}, []);

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
					multiselect
				/>
				<Autocomplete
					css={inputStyle}
					freeSolo
					includeInputInList
					autoComplete
					disableClearable
					options={autocompleteSuggestions.data || []}
					filterOptions={it => it}
					inputValue={query}
					onInputChange={handleQueryChange}
					renderOption={(props, option) => (
						<li {...props}>
							<div css={autocompleteNameStyle}>
								{option.label.slice(0, option.highlight[0])}
								<strong>{option.label.slice(option.highlight[0], option.highlight[1])}</strong>
								{option.label.slice(option.highlight[1])}
							</div>
							<div css={autocompleteTypeStyle}>{option.type}</div>
						</li>
					)}
					renderInput={(params) =>
						<TextField
							{...params}
							css={textFieldStyle}
							fullWidth
							id="search"
							placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
						/>
					}
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
