/** @jsxImportSource @emotion/react */
import { useCallback } from "react";
import { css, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
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
	page: number;
	pageSize: number;
	hasNextPage: boolean;
	hideOnSinglePage?: boolean;
	onPageChange?: (page: number) => void;
};

export function TablePagination(props: TablePaginationProps) {
	const {
		page,
		pageSize,
		hasNextPage = true,
		hideOnSinglePage = true,
		onPageChange,
	} = props;

	if (hideOnSinglePage && page === 1 && !hasNextPage) {
		return null;
	}

	const setPreviousPage = useCallback(() => {
		onPageChange?.(page - 1);
	}, [page, onPageChange]);

	const setNextPage = useCallback(() => {
		onPageChange?.(page + 1);
	}, [page, onPageChange]);

	return (
		<div css={paginationStyle}>
			<IconButton css={buttonStyle} disabled={page === 1} onClick={setPreviousPage}>
				<ChevronLeft />
			</IconButton>
			<IconButton css={buttonStyle} disabled={!hasNextPage} onClick={setNextPage}>
				<ChevronRight />
			</IconButton>
		</div>
	);
}
