/** @jsxImportSource @emotion/react */
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { css, IconButton } from "@mui/material";

import { Theme } from "@emotion/react";

const paginationStyle = css`
	display: flex;
	justify-content: right;
	margin-top: 16px;
`;

const buttonStyle = (theme: Theme) => css`
	padding: 4px;

	border-radius: 4px;
	color: white;
	background-color: ${theme.palette.secondary.main};

	margin-left: 8px;

	&:hover {
		background-color: ${theme.palette.secondary.dark};
	}

	&.Mui-disabled {
		color: white;
		background-color: #dcdcdc;
	}
`;

export type TablePaginationProps = {
	offset: number;
	limit: number;
	hasNext?: boolean;
	hideOnSinglePage?: boolean;
	setPreviousPage: () => void;
	setNextPage: () => void;
};

export function TablePagination(props: TablePaginationProps) {
	const {
		offset,
		limit,
		hasNext = true,
		hideOnSinglePage = true,
		setPreviousPage,
		setNextPage,
	} = props;

	if (hideOnSinglePage && offset === 0 && !hasNext) {
		return null;
	}

	return (
		<div css={paginationStyle}>
			<IconButton css={buttonStyle} disabled={offset === 0} onClick={() => setPreviousPage()}>
				<ChevronLeft />
			</IconButton>
			<IconButton css={buttonStyle} disabled={!hasNext} onClick={() => setNextPage()}>
				<ChevronRight />
			</IconButton>
		</div>
	);
}
