/** @jsxImportSource @emotion/react */
import { Children, HTMLAttributes, ReactElement, ReactNode } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { css, Interpolation, Theme } from "@emotion/react";

import { Pagination } from "../hooks/usePagination";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { TablePagination } from "./TablePagination";
import { ErrorMessage } from "./ErrorMessage";

const tableStyle = css`
	table-layout: fixed;
	min-width: 860px;
`;

const cellStyle = css`
	word-break: break-all;

	&:first-child {
		padding-left: 0;
	}

	&:last-child {
		padding-right: 0;
	}
`;

export type ItemsTableAttributeProps<T = any> = {
	label: string;
	colCss?: Interpolation<Theme>;
	render: (data: T) => ReactNode;
}

export const ItemsTableAttribute = <T extends object = any>(props: ItemsTableAttributeProps<T>) => {
	return null;
};

export type ItemsTableProps<T extends {id: string}> = HTMLAttributes<HTMLDivElement> & {
	items: T[];
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	pagination: Pagination;
	children: ReactElement<ItemsTableAttributeProps<T>>|(ReactElement<ItemsTableAttributeProps<T>>|false|undefined|null)[];
};

export const ItemsTable = <T extends {id: string}>(props: ItemsTableProps<T>) => {
	const {
		items,
		loading,
		notFound,
		notFoundMessage = "No items found",
		error,
		errorMessage = "Unexpected error occured while fetching items",
		pagination,
		children,
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
				<Table css={tableStyle}>
					<colgroup>
						{Children.map(children, (child) => child && <col css={child.props.colCss} />)}
					</colgroup>
					<TableHead>
						<TableRow>
							{Children.map(children, (child) => child && (
								<TableCell css={cellStyle}>
									{child.props.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map(item =>
							<TableRow key={item.id}>
								{Children.map(children, (child) => child && (
									<TableCell css={cellStyle}>
										{child.props.render(item)}
									</TableCell>
								))}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination {...pagination} />
		</div>
	);
};
