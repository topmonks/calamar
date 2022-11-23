/** @jsxImportSource @emotion/react */
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { css } from "@emotion/react";

const valueTableStyle = css`
	width: fit-content;
	word-break: initial;

	th, td {
		vertical-align: top;
		padding: 0;
	}

	td:first-of-type {
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
	}
`;

const paramIndexCellStyle = css`
	width: 60px;
`;

const paramNameCellStyle = css`
	width: 180px;
`;

const paramIndexStyle = css`
	font-weight: 300;
	word-break: break-all;
	box-sizing: border-box;
	width: 60px;
	padding: 6px 0;
	padding-right: 16px;
	position: sticky;
	top: 0;
`;

const paramNameStyle = css`
	font-weight: 700;
	word-break: break-all;
	box-sizing: border-box;
	width: 180px;
	padding: 6px 0;
	padding-right: 32px;
	position: sticky;
	top: 0;
`;

const paramKindStyle = css`
	font-weight: 400;
	font-style: italic;
`;

const paramValueStyle = css`
	word-break: break-all;
	min-width: 180px;
	max-width: 550px;
	padding: 6px 0;
`;

export type EventParamValueProps = {
	value: any;
};

export const DataViewerValueTable = (props: EventParamValueProps) => {
	let { value } = props;

	if (Array.isArray(value) && value.length > 0) {
		return (
			<Table size="small" css={valueTableStyle}>
				<TableBody>
					{value.map((item, index) => (
						<TableRow key={index}>
							<TableCell css={paramIndexCellStyle}>
								<div css={paramIndexStyle}>{index}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueTable value={item} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (Array.isArray(value) && value.length === 0) {
		value = "[ ]";
	} else if (value && typeof value === "object") {
		if (value.__kind) {
			const kind = value.__kind;
			value = {...value};
			delete value.__kind;

			if (Object.keys(value).length === 1 && value.value) {
				value = value.value;
			}

			return (
				<Table size="small" css={valueTableStyle}>
					<TableBody>
						<TableRow>
							<TableCell css={paramNameCellStyle}>
								<div css={[paramNameStyle, paramKindStyle]}>{kind}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueTable value={value} />
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			);
		}

		const keys = Object.keys(value);
		keys.sort();

		return (
			<Table size="small" css={valueTableStyle}>
				<TableBody>
					{keys.map((key) => (
						<TableRow key={key}>
							<TableCell css={paramNameCellStyle}>
								<div css={paramNameStyle}>{key}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueTable value={value[key]} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (typeof value === "boolean") {
		value = value ? "true" : "false";
	}

	return <div css={paramValueStyle}>{value}</div>;
};
