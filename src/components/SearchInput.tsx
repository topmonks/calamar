/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

import NetworkSelect from "./NetworkSelect";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

const networkSelectStyle = (variant: string) => (theme: Theme) => css`
	&, &:hover, &.Mui-focused {
		.MuiOutlinedInput-notchedOutline {
			border-color: #c4cdd5;
			border-right: none;
		}
	}

	${["1", "2"].includes(variant) && css`
		&::before,
		&::after {
			position: absolute;
			content: '';
			display: block;
			width: 1px;
			height: 24px;
			background-color: #c4cdd5;
			z-index: 10;
		}
	`}

	${["3", "4"].includes(variant) && css`
		.MuiSelect-select {
			> * {
				position: relative;
				z-index: 10;
			}

			&::before,
			&::after {
				position: absolute;
				content: '';
				display: block;
				height: 32px;
				left: 8px;
				right: 8px;
				background-color: #dedede;
				z-index: 0;
				border-radius: 6px;
			}
		}

		.MuiSelect-icon {
			right: 12px;
		}

		.MuiListItemIcon-root {
			min-width: 30px;

			img {
				width: 20px;
				height: 20px;
			}
		}
	`}

	&::before {
		left: 0;
	}

	&::after {
		right: 0;
	}

	&:first-child {
		&::before {
			display: none;
		}

		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	&:not(:first-child) {
		&.MuiInputBase-root {
			border-radius: 0;
		}

		.MuiOutlinedInput-notchedOutline {
			border-left: none;
		}

		&::after {
			display: none;
		}
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
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;

		&, &:hover, &.Mui-focused {
			.MuiOutlinedInput-notchedOutline {
				border-color: #c4cdd5;
				border-right: none;
			}
		}
	}

	&:not(:first-child) {
		.MuiInputBase-root {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}

		.MuiOutlinedInput-notchedOutline {
			border-left: none;
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
	defaultNetwork?: string;
	persistNetwork?: boolean;
	onNetworkChange?: (network?: string) => void;
};

function SearchInput(props: SearchInputProps) {
	const { defaultNetwork, persistNetwork, onNetworkChange, ...restProps } = props;

	console.log("default network", defaultNetwork);

	const [qs] = useSearchParams();
	const query = qs.get("query");
	console.log(qs, query);

	const [network, setNetwork] = useState<string | undefined>(defaultNetwork);
	const [search, setSearch] = useState<string>(query || "");

	const navigate = useNavigate();

	const handleNetworkSelect = useCallback((network: string, isUserAction: boolean) => {
		if (isUserAction && persistNetwork) {
			console.log("store", network);
			localStorage.setItem("network", network);
		}

		setNetwork(network);
	}, [persistNetwork]);

	const handleSubmit = useCallback(
		(e: any) => {
			if (!network) {
				return;
			}

			e.preventDefault();
			localStorage.setItem("network", network);
			navigate(`/${network}/search?query=${search}`);
		},
		[navigate, network, search]
	);

	useEffect(() => {
		if (persistNetwork) {
			const network = localStorage.getItem("network");
			network && setNetwork(network);
		}
	}, [persistNetwork]);

	useEffect(() => {
		onNetworkChange?.(network);
	}, [onNetworkChange, network]);

	// TODO this is temporary until resolved
	const searchInputVariant = qs.get("search-input-variant") || "1";

	return (
		<form {...restProps} onSubmit={handleSubmit}>
			<FormGroup row css={formGroupStyle}>
				{["1", "3"].includes(searchInputVariant) &&
					<NetworkSelect
						css={networkSelectStyle(searchInputVariant)}
						onChange={handleNetworkSelect}
						value={network}
					/>
				}
				<TextField
					css={textFieldStyle}
					fullWidth
					id="search"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
					value={search}
				/>
				{["2", "4"].includes(searchInputVariant) &&
					<NetworkSelect
						css={networkSelectStyle(searchInputVariant)}
						onChange={handleNetworkSelect}
						value={network}
					/>
				}
				<Button
					css={buttonStyle}
					onClick={handleSubmit}
					startIcon={<SearchIcon />}
					type="submit"
					variant="contained"
					color="primary"
				>
					<span className="text">Search</span>
				</Button>
			</FormGroup>
		</form>
	);
}

export default SearchInput;
