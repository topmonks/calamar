/** @jsxImportSource @emotion/react */
import { FormHTMLAttributes, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, FormGroup, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { css, Theme } from "@emotion/react";

const formGroupStyle = css`
	flex-direction: row;
	justify-content: center;
	flex-wrap: nowrap;
`;

const textFieldStyle = css`
	.MuiInputBase-root {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.MuiOutlinedInput-notchedOutline {
		border-color: #c4cdd5;
		border-right: none;
	}

	.MuiOutlinedInput-notchedOutline,
	&:hover .MuiOutlinedInput-notchedOutline,
	.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: #c4cdd5;
	}
`;

const buttonStyle = (theme: Theme) => css`
	border-radius: 8px;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
	border: 1px solid ${theme.palette.primary.dark};

	.text {
		display: none;
	}

	.MuiButton-startIcon {
		margin: 0;

		svg {
			font-size: 28px;
		}
	}

	@media (min-width: 720px) {
		.text {
			display: inline-block;
		}

		.MuiButton-startIcon {
			display: none;
		}
	}
`;

export type SearchInputProps = FormHTMLAttributes<HTMLFormElement> & {
	network: string | undefined;
};

function SearchInput(props: SearchInputProps) {
	const { network } = props;

	const [qs] = useSearchParams();
	const query = qs.get("query");
	console.log(qs, query);

	const [search, setSearch] = useState<string>(query || "");

	const navigate = useNavigate();

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

	return (
		<form {...props} onSubmit={handleSubmit}>
			<FormGroup row css={formGroupStyle}>
				<TextField
					css={textFieldStyle}
					fullWidth
					id="search"
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Extrinsic hash / account address / block hash / block height / extrinsic name / event name"
					value={search}
				/>
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
