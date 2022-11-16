/** @jsxImportSource @emotion/react */
import { HTMLAttributes, PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import { css } from "@emotion/react";

import { Pagination } from "../hooks/usePagination";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { TablePagination } from "./TablePagination";
import { ErrorMessage } from "./ErrorMessage";

const tableStyle = css`
	table-layout: fixed;
	min-width: 860px;

	td, th {
		word-break: break-all;

		&:first-child, &:first-child {
			padding-left: 0;
		}

		&:last-child, &:last-child {
			padding-right: 0;
		}
	}
`;

export type ItemsTableProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
	pagination: Pagination;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
}>;

function ItemsTable(props: ItemsTableProps) {
	const {
		pagination,
		children,
		loading,
		notFound,
		notFoundMessage = "No items found",
		error,
		errorMessage = "Unexpected error occured while fetching items",
		...restProps
	} = props;

	if (loading) {
		return <Loading />;
	}

	if (notFound) {
		return <NotFound>{notFoundMessage}</NotFound>;
	}

	if (error) {
		return (
			<ErrorMessage
				message={errorMessage}
				details={error.message}
				showReported
			/>
		);
	}

	return (
		<div {...restProps}>
			<TableContainer>
				<Table css={tableStyle}>{children}</Table>
			</TableContainer>
			<TablePagination {...pagination} />
		</div>
	);
}

export default ItemsTable;
