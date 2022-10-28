/** @jsxImportSource @emotion/react */
import { HTMLAttributes, PropsWithChildren } from "react";
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

export type ItemsTableProps = PropsWithChildren<HTMLAttributes<HTMLDivElement> & {
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
		...restProps
	} = props;

	if (loading) {
		return <Loading />;
	}

	if (items && items.length === 0) {
		return <NotFound>{noItemsMessage}</NotFound>;
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
