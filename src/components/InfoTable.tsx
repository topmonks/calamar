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

const labelCellStyle = (theme: Theme) => css`
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

const valueCellStyle = (theme: Theme) => css`
	word-break: break-all;
	padding-right: 0;

	${theme.breakpoints.down("sm")} {
		padding-left: 0;
	}
`;

const valueStyle = css`
	display: flex;

	> img:only-child {
		display: block;
	}

	> .MuiButton-root:only-child {
		&.MuiButton-sizeSmall {
			margin: -4px 0;
		}
	}

	> .MuiChip-root:only-child {
		display: flex;
	}
`;

const copyButtonStyle = css`
	margin-left: 16px;
`;

type InfoTableGetter<T, A extends any[], R> = (data: T, ...additionalData: A) => R;

export type InfoTableAttributeProps<T, A extends any[]> = {
	name?: string;
	label: ReactNode | InfoTableGetter<T, A, ReactNode>;
	labelCss?: Interpolation<Theme>;
	valueCss?: Interpolation<Theme>;
	render: InfoTableGetter<T, A, ReactNode>;
	copyToClipboard?: InfoTableGetter<T, A, string|undefined>;
	hide?: InfoTableGetter<T, A, boolean>;
	_data?: T;
	_additionalData?: A;
}

export const InfoTableAttribute = <T extends object = any, A extends any[] = []>(props: InfoTableAttributeProps<T, A>) => {
	const {
		label,
		labelCss: labelCellStyleOverride,
		valueCss: valueCellStyleOverride,
		render,
		copyToClipboard,
		hide,
		_data,
		_additionalData = [] as any
	} = props;

	if (!_data || hide?.(_data, ..._additionalData)) {
		return null;
	}

	return (
		<TableRow css={attributeStyle}>
			<TableCell css={[labelCellStyle, labelCellStyleOverride]}>
				{typeof label === "function"
					? label(_data, ..._additionalData)
					: label
				}
			</TableCell>
			<TableCell css={[valueCellStyle, valueCellStyleOverride]}>
				<div css={valueStyle}>
					{render?.(_data, ..._additionalData)}
					{copyToClipboard?.(_data, ..._additionalData) &&
						<CopyToClipboardButton
							css={copyButtonStyle}
							value={copyToClipboard(_data, ..._additionalData)}
						/>
					}
				</div>
			</TableCell>
		</TableRow>
	);
};

export type InfoTableProps<T extends object, A extends any[] = []> = {
	data: T;
	additionalData?: A;
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
	children: ReactElement<InfoTableAttributeProps<T, A>>|(ReactElement<InfoTableAttributeProps<T, A>>|false|undefined|null)[];
};

export const InfoTable = <T extends object, A extends any[] = []>(props: InfoTableProps<T, A>) => {
	const {
		data,
		additionalData,
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
							child && cloneElement(child, {
								_data: data,
								_additionalData: additionalData
							}))
						}
					</TableBody>
				}
			</Table>
		</TableContainer>
	);
};
