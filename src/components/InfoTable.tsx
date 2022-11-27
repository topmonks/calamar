/** @jsxImportSource @emotion/react */
import { Children, cloneElement, ReactElement, ReactNode } from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { css, Interpolation, Theme } from "@emotion/react";

import CopyToClipboardButton from "./CopyToClipboardButton";
import Loading from "./Loading";
import NotFound from "./NotFound";
import { ErrorMessage } from "./ErrorMessage";

const tableStyles = (theme: Theme) => css`
	table-layout: fixed;

	${theme.breakpoints.down("sm")} {
		&,
		& > tbody,
		& > tbody > tr,
		& > tbody > tr > td,
		& > tbody > tr > th {
			display: block;
		}
	}
`;

const attributeStyle = css`
	& > td {
		position: relative;
		vertical-align: top;
		line-height: 24px;
	}

	&:last-child > td {
		padding-bottom: 0;
	}
`;

const labelStyle = (theme: Theme) => css`
	width: 200px;
	padding-left: 0;
	font-weight: 700;

	${theme.breakpoints.down("sm")} {
		width: auto;
		padding-right: 0;
		padding-bottom: 0;
		border-bottom: none;
	}
`;

const valueStyle = (theme: Theme) => css`
	word-break: break-all;
	padding-right: 0;

	> img:only-child {
		display: block;
	}

	> .MuiChip-root:only-child {
		display: flex;
	}

	${theme.breakpoints.down("sm")} {
		padding-left: 0;
	}
`;


export type InfoTableAttributeProps<T> = {
	name?: string;
	label: string;
	labelCss?: Interpolation<Theme>;
	valueCss?: Interpolation<Theme>;
	render: (data: T) => ReactNode;
	copyToClipboard?: (data: T) => string|undefined;
	hide?: (data: T) => boolean;
	_data?: T;
}

export const InfoTableAttribute = <T extends object = any>(props: InfoTableAttributeProps<T>) => {
	const {
		label,
		labelCss: labelStyleOverride,
		valueCss: valueStyleOverride,
		render,
		copyToClipboard,
		hide,
		_data
	} = props;

	if (!_data || hide?.(_data)) {
		return null;
	}

	return (
		<TableRow css={attributeStyle}>
			<TableCell css={[labelStyle, labelStyleOverride]}>
				{label}
			</TableCell>
			<TableCell css={[valueStyle, valueStyleOverride]}>
				{render?.(_data)}
				{copyToClipboard?.(_data) &&
					<CopyToClipboardButton value={copyToClipboard(_data)} />
				}
			</TableCell>
		</TableRow>
	);
};

export type InfoTableProps<T> = {
	data: any;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	children: ReactElement<InfoTableAttributeProps<T>>|(ReactElement<InfoTableAttributeProps<T>>|false|undefined|null)[];
};

export const InfoTable = <T extends object>(props: InfoTableProps<T>) => {
	const {
		data,
		loading,
		notFound,
		notFoundMessage = "No item found",
		error,
		errorMessage = "Unexpected error occured while fetching data",
		children
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
		<TableContainer>
			<Table css={tableStyles}>
				{data &&
					<TableBody>
						{Children.map(children, (child) =>
							child && cloneElement(child, {_data: data}))
						}
					</TableBody>
				}
			</Table>
		</TableContainer>
	);
};
