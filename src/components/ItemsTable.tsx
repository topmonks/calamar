/** @jsxImportSource @emotion/react */
import { Children, cloneElement, HTMLAttributes, ReactElement, ReactNode } from "react";
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

	&:first-of-type {
		padding-left: 0;
	}

	&:last-of-type {
		padding-right: 0;
	}
`;

type ItemsTableItem = {
	id: string;
}

type ItemsTableDataFn<T, A extends any[], R> = (data: T, ...additionalData: A) => R;

export type ItemsTableAttributeProps<T, A extends any[]> = {
	label: string;
	colCss?: Interpolation<Theme>;
	render: ItemsTableDataFn<T, A, ReactNode>;
	colSpan?: ItemsTableDataFn<T, A, number>;
	hide?: ItemsTableDataFn<T, A, boolean>;
	_data?: T;
	_additionalData?: A;
}

export const ItemsTableAttribute = <T extends object = any, A extends any[] = []>(props: ItemsTableAttributeProps<T, A>) => {
	const {
		label,
		colCss,
		colSpan,
		render,
		hide,
		_data,
		_additionalData = [] as any
	} = props;

	if (!_data || hide?.(_data, ..._additionalData)) {
		return null;
	}

	return (
		<TableCell css={cellStyle} colSpan={colSpan?.(_data, ..._additionalData)}>
			{render(_data, ..._additionalData)}
		</TableCell>
	);
};

export type ItemsTableProps<T extends ItemsTableItem, A extends any[] = []> = HTMLAttributes<HTMLDivElement> & {
	data?: T[];
	additionalData?: A;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	pagination?: Pagination;
	children: ReactElement<ItemsTableAttributeProps<T, A>>|(ReactElement<ItemsTableAttributeProps<T, A>>|false|undefined|null)[];
};

export const ItemsTable = <T extends ItemsTableItem, A extends any[] = []>(props: ItemsTableProps<T, A>) => {
	const {
		data,
		additionalData,
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
						{data?.map(item =>
							<TableRow key={item.id}>
								{Children.map(children, (child) =>
									child && cloneElement(child, {
										_data: item,
										_additionalData: additionalData
									}))
								}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			{pagination && <TablePagination {...pagination} />}
		</div>
	);
};
