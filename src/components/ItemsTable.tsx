/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import { css } from "@emotion/react";

import { Pagination } from "../hooks/usePagination";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { TablePagination } from "./TablePagination";

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

export type ItemsTableProps = PropsWithChildren<{
	pagination: Pagination;
	loading?: boolean;
	items?: any[];
	noItemsMessage?: string;
}>;

function ItemsTable(props: ItemsTableProps) {
	const {
		pagination,
		children,
		loading,
		items,
		noItemsMessage = "No items found",
	} = props;

	if (loading) {
		return <Loading />;
	}

	if (items && items.length === 0) {
		return <NotFound>{noItemsMessage}</NotFound>;
	}

	return (
		<>
			<TableContainer>
				<Table css={tableStyle}>{children}</Table>
			</TableContainer>
			<TablePagination {...pagination} />
		</>
	);
}

export default ItemsTable;
