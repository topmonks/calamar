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

type ItemsTableItem = {
	id: string;
}

type ItemsTableGetter<T, A extends any[], R> = (data: T, ...additionalData: A) => R;

export type ItemsTableAttributeProps<T, A extends any[]> = {
	label: string;
	colCss?: Interpolation<Theme>;
	render: ItemsTableGetter<T, A, ReactNode>;
}

export const ItemsTableAttribute = <T extends object = any, A extends any[] = []>(props: ItemsTableAttributeProps<T, A>) => {
	return null;
};

export type ItemsTableProps<T extends ItemsTableItem, A extends any[] = []> = HTMLAttributes<HTMLDivElement> & {
	data?: T[];
	additionalData?: A;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	pagination: Pagination;
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
								{Children.map(children, (child) => child && (
									<TableCell css={cellStyle}>
										{child.props.render(item, ...(additionalData || [] as any))}
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
