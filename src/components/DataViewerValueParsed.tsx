/** @jsxImportSource @emotion/react */
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { css } from "@emotion/react";
import { isAddress } from "@polkadot/util-crypto";

import { useAccount } from "../hooks/useAccount";

import { AccountAddress } from "./AccountAddress";
import CopyToClipboardButton from "./CopyToClipboardButton";

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

const arrayIndexCellStyle = css`
	width: 60px;
`;

const arrayIndexStyle = css`
	font-weight: 300;
	word-break: break-all;
	box-sizing: border-box;
	width: 60px;
	padding: 6px 0;
	padding-right: 16px;
	position: sticky;
	top: 0;
`;

const objectKeyCellStyle = css`
	width: 180px;
`;

const objectKeyStyle = css`
	font-weight: 700;
	word-break: break-all;
	box-sizing: border-box;
	width: 180px;
	padding: 6px 0;
	padding-right: 32px;
	position: sticky;
	top: 0;
`;

const kindStyle = css`
	font-weight: 400;
	font-style: italic;
`;

const valueStyle = css`
	display: flex;
	word-break: break-all;
	min-width: 180px;
	max-width: 550px;
	padding: 6px 0;
`;

const copyButtonStyle = css`
	margin-left: 12px;
`;

type MaybeAccountLinkValueProps = {
	network: string;
	value: string;
}

const MaybeAccountLinkValue = (props: MaybeAccountLinkValueProps) => {
	const {network, value} = props;

	const account = useAccount(network, value);

	if (account.loading) {
		return null;
	}

	if (account.data) {
		return (
			<div css={valueStyle}>
				<AccountAddress network={network} address={value} />
				<CopyToClipboardButton value={value} css={copyButtonStyle} />
			</div>
		);
	}

	return <div css={valueStyle}>{value}</div>;
};

export type DataViewerValueParsedProps = {
	network: string;
	value: any;
};

export const DataViewerValueParsed = (props: DataViewerValueParsedProps) => {
	const { network } = props;
	let { value } = props;

	if (Array.isArray(value) && value.length > 0) {
		return (
			<Table size="small" css={valueTableStyle}>
				<TableBody>
					{value.map((item, index) => (
						<TableRow key={index}>
							<TableCell css={arrayIndexCellStyle}>
								<div css={arrayIndexStyle}>{index}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed network={network} value={item} />
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
							<TableCell css={objectKeyCellStyle}>
								<div css={[objectKeyStyle, kindStyle]}>{kind}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed network={network} value={value} />
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
							<TableCell css={objectKeyCellStyle}>
								<div css={objectKeyStyle}>{key}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed network={network} value={value[key]} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (isAddress(value) && value.length === 66) {
		return <MaybeAccountLinkValue network={network} value={value} />;
	} else if (typeof value === "boolean") {
		value = value ? "true" : "false";
	}

	return <div css={valueStyle}>{value}</div>;
};
