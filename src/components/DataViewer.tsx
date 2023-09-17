/** @jsxImportSource @emotion/react */
import { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { css, Theme } from "@emotion/react";
import { IconButton, Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Close } from "@mui/icons-material";

import { config } from "../config";

import { DecodedArg } from "../model/decodedMetadata";
import { Network } from "../model/network";

import CopyToClipboardButton from "./CopyToClipboardButton";
import { DataViewerValueJson } from "./DataViewerValueJson";
import { DataViewerValueParsed } from "./DataViewerValueParsed";
import { Devtool } from "./Devtool";

const dataViewerStyle = css`
	display: flex;
	padding: 12px;
	height: 100%;
	max-width: 100%;
	box-sizing: border-box;
	flex-direction: column;
	flex: 1 1 auto;

	background-color: #f5f5f5;
	border-radius: 8px;

	line-height: 24px;
	overflow: hidden;
	word-break: initial;
`;

const embeddedDataViewerStyle = (theme: Theme) => css`
	max-height: 500px;

	${theme.breakpoints.down("sm")} {
		max-height: 250px;
	}
`;

const simpleDataViewerStyle = css`
	flex-direction: row-reverse;
`;

const modalStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;

	height: calc(100vh - 32px);
	width: calc(100vw - 32px);
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 32px);

	flex-direction: column;
	outline: none;

	@media (min-height: calc(500px + 32px)) {
		height: auto;
		min-height: 500px;
	}

	@media (min-width: calc(1600px + 32px)) {
		width: 1600px;
	}
`;

const scrollAreaStyle = css`
	position: relative;
	overflow: auto;
	flex: 1 1 auto;

	> * {
		margin: 0 12px;
		width: auto !important;
	}
`;

const controlsStyle = css`
	display: flex;
	margin-bottom: 12px;
	align-items: center;
	font-size: 14px;

	.MuiModal-root & {
		padding-right: 34px;
	}
`;

const simpleControlsStyle = css`
	align-items: flex-start;
	margin-bottom: 0;
	margin-left: 12px;
`;

const modeButtonsStyle = css`
	margin-right: auto;
`;

const modeButtonStyle = css`
	font-size: 14px;
	font-weight: 600;
	padding: 0 8px;
	line-height: 24px;
`;

const fullscreenButtonStyle = css`
	padding: 2px;
	margin-left: 8px;
`;

const copyButtonStyle = css`
	padding: 2px;
`;

const closeButtonStyle = css`
	position: absolute;
	top: 0;
	right: 0;
	margin: 12px;
	padding: 0;

	z-index: 10;
`;

export type DataViewerMode = "json" | "parsed" | "meta";

const MODES: (DataViewerMode|false)[] = [
	"parsed",
	"json",
	config.devtools.enabled && "meta"
];

const modeLabels: Record<DataViewerMode, ReactNode> = {
	parsed: "Parsed",
	json: "Raw",
	meta: <Devtool>Meta</Devtool>
};

type ModeSelectProps = {
	value: DataViewerMode;
	onChange: (mode: DataViewerMode) => void;
};

const ModeSelect = (props: ModeSelectProps) => {
	const {value, onChange} = props;

	return (
		<ToggleButtonGroup
			css={modeButtonsStyle}
			exclusive
			value={value}
			onChange={(_, mode) => mode && onChange(mode)}
		>
			{MODES.map(mode => mode &&
				<ToggleButton key={mode} css={modeButtonStyle} value={mode}>
					{modeLabels[mode]}
				</ToggleButton>
			)}
		</ToggleButtonGroup>
	);
};

export type DataViewerModalHandleProps = PropsWithChildren;

const DataViewerModalHandle = (props: DataViewerModalHandleProps) => {
	const {children} = props;

	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<IconButton css={fullscreenButtonStyle} onClick={() => setShowModal(true)}>
				<svg
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1,1 h7v2h-5v5h-2z M12,1 h7v7h-2v-5h-5z M19,12 v7h-7v-2h5v-5z M8,19 h-7v-7h2v5h5z"
						fill="currentColor"
					/>
				</svg>
			</IconButton>
			<Modal
				open={showModal}
				onClose={() => setShowModal(false)}
				keepMounted
			>
				<div css={modalStyle}>
					<IconButton css={closeButtonStyle} onClick={() => setShowModal(false)}>
						<Close />
					</IconButton>
					{children}
				</div>
			</Modal>
		</>
	);
};

export type DataViewerProps = {
	network: Network;
	data: any;
	metadata?: DecodedArg[];
	modes?: DataViewerMode[];
	defaultMode?: DataViewerMode;
	simple?: boolean;
	copyToClipboard?: boolean;
};

export const DataViewer = (props: DataViewerProps) => {
	const {
		network,
		data,
		metadata,
		defaultMode = MODES.find(Boolean),
		simple,
		copyToClipboard,
	} = props;

	const [mode, setMode] = useState<DataViewerMode>(defaultMode || MODES.find(Boolean) as DataViewerMode);

	console.log("render");

	const copyToClipboardValue = useMemo(() => {
		if (Array.isArray(data) || typeof data === "object") {
			return JSON.stringify(data, null, 4);
		}

		return data;
	}, [data]);

	const jsonContent = useMemo(() => (!simple || defaultMode === "json") && (
		<DataViewerValueJson value={data} />
	), [data]);

	const parsedContent = useMemo(() => (!simple || defaultMode === "parsed") && (
		<DataViewerValueParsed
			network={network}
			value={data}
			metadata={metadata}
		/>
	), [data]);

	return (
		<div
			css={[
				dataViewerStyle,
				simple
					? simpleDataViewerStyle
					: embeddedDataViewerStyle
			]}
		>
			<div css={[controlsStyle, simple && simpleControlsStyle]}>
				{!simple && <ModeSelect value={mode} onChange={setMode} />}
				{copyToClipboard && <CopyToClipboardButton value={copyToClipboardValue} css={copyButtonStyle} />}
				{!simple &&
					<DataViewerModalHandle>
						<div css={dataViewerStyle}>
							<div css={[controlsStyle]}>
								<ModeSelect value={mode} onChange={setMode} />
								{copyToClipboard && <CopyToClipboardButton value={copyToClipboardValue} css={copyButtonStyle} />}
							</div>
							<div css={scrollAreaStyle}>
								{mode === "json" && jsonContent}
								{mode === "parsed" && parsedContent}
								{metadata && mode === "meta" && <DataViewerValueJson value={metadata} />}
							</div>
						</div>
					</DataViewerModalHandle>
				}
			</div>
			<div css={scrollAreaStyle}>
				{mode === "json" && jsonContent}
				{mode === "parsed" && parsedContent}
				{mode === "meta" && <DataViewerValueJson value={metadata} />}
			</div>
		</div>
	);
};

export default DataViewer;
