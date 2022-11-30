/** @jsxImportSource @emotion/react */
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { css } from "@emotion/react";

import { DecodedArg } from "../model/decodedMetadata";
import { assert } from "../utils/assert";
import { noCase } from "../utils/string";

import { AccountAddress } from "./AccountAddress";
import CopyToClipboardButton from "./CopyToClipboardButton";

// found in https://github.com/polkadot-js/apps/blob/59c2badf87c29fd8cb5b7dfcc045c3ce451a54bc/packages/react-params/src/Param/findComponent.ts#L51
const ADDRESS_TYPES = ["AccountId", "AccountId20", "AccountId32", "Address", "LookupSource", "MultiAddress"];

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

type ValueOfKindProps = {
	network: string;
	value: {
		__kind: string,
		value: any;
	};
	metadata?: DecodedArg;
}

const ValueOfKind = (props: ValueOfKindProps) => {
	const {network, value, metadata} = props;

	assert(value, value.__kind && (Object.keys(value).length === 1 || (Object.keys(value).length === 2 && value.value)));

	return (
		<Table size="small" css={valueTableStyle}>
			<TableBody>
				<TableRow>
					<TableCell css={objectKeyCellStyle}>
						<div css={[objectKeyStyle, kindStyle]}>{value.__kind}</div>
					</TableCell>
					<TableCell>
						<DataViewerValueParsed
							network={network}
							value={value.value}
							metadata={metadata}
						/>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
};

type MaybeAccountLinkValueProps = {
	network: string;
	value: any;
	metadata: DecodedArg;
}

const AccountValue = (props: MaybeAccountLinkValueProps) => {
	const {network, value, metadata} = props;

	if (metadata.type === "MultiAddress") {
		if (value.__kind === "Id") {
			return <ValueOfKind
				network={network}
				value={value}
				metadata={{
					...metadata,
					type: "AccountId"
				}}
			/>;
		} else {
			return (
				<DataViewerValueParsed
					network={network}
					value={value}
				/>
			);
		}
	}

	return (
		<div css={valueStyle}>
			<AccountAddress network={network} address={value} />
			<CopyToClipboardButton value={value} css={copyButtonStyle} />
		</div>
	);
};

export type DataViewerValueParsedProps = {
	network: string;
	value: any;
	metadata?: DecodedArg[]|DecodedArg;
};

export const DataViewerValueParsed = (props: DataViewerValueParsedProps) => {
	const { network, metadata } = props;
	let { value } = props;

	if (metadata && ADDRESS_TYPES.includes((metadata as DecodedArg).type)) {
		return (
			<AccountValue
				network={network}
				value={value}
				metadata={metadata as DecodedArg}
			/>
		);
	}

	if (Array.isArray(value) && value.length > 0) {
		const itemsMetadata = value.map((item, index) => {
			if (Array.isArray(metadata)) {
				return metadata.find(it => it.name === index.toString());
			}

			const vecType = metadata?.type.match(/^Vec<(.+)>$/);
			if (vecType) {
				return {
					name: index.toString(),
					type: vecType[1]
				};
			}

			return undefined;
		});

		return (
			<Table size="small" css={valueTableStyle}>
				<TableBody>
					{value.map((item, index) => (
						<TableRow key={index}>
							<TableCell css={arrayIndexCellStyle}>
								<div css={arrayIndexStyle}>{index}</div>
							</TableCell>
							<TableCell>
								<DataViewerValueParsed
									network={network}
									value={item}
									metadata={itemsMetadata[index]}
								/>
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
			return (
				<ValueOfKind
					network={network}
					value={value}
				/>
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
								<DataViewerValueParsed
									network={network}
									value={value[key]}
									metadata={Array.isArray(metadata)
										? metadata?.find(it => noCase(it.name) === noCase(key))
										: undefined
									}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		);
	} else if (typeof value === "boolean") {
		value = value ? "true" : "false";
	}

	return <div css={valueStyle}>{value}</div>;
};
