/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { css, Theme } from "@emotion/react";
import { darken, IconButton, Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Close } from "@mui/icons-material";

import CopyToClipboardButton from "./CopyToClipboardButton";
import { DataViewerValueJson } from "./DataViewerValueJson";
import { DataViewerValueParsed }  from "./DataViewerValueParsed";

const dataViewerStyle = css`
	display: flex;
	padding: 12px;
	max-width: 100%;
	box-sizing: border-box;
	flex-direction: column;

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

const modalDataViewerStyle = css`
	position: relative;
	height: calc(100vh - 32px);
	width: calc(100vw - 32px);
	max-width: calc(100vw - 32px);
	max-height: calc(100vh - 32px);

	@media (min-height: calc(500px + 32px)) {
		height: auto;
		min-height: 500px;
	}

	@media (min-width: calc(1600px + 32px)) {
		width: 1600px;
	}
`;

const modalStyle = css`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	outline: none;
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

export type DataViewerMode = "json" | "parsed";

const modeLabels: Record<DataViewerMode, string> = {
	parsed: "Parsed",
	json: "Raw"
};

export type DataViewerProps = {
	network: string;
	data: any;
	modes?: DataViewerMode[];
	defaultMode?: DataViewerMode;
	simple?: boolean;
	copyToClipboard?: boolean;
	isModal?: boolean;
};

const DataViewerModalHandle = (props: DataViewerProps) => {
	const {isModal} = props;

	const [showModal, setShowModal] = useState<boolean>(false);

	if (isModal) {
		return <span css={{width: 32}} />;
	}

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
					<DataViewer {...props} isModal />
				</div>
			</Modal>
		</>
	);
};

function DataViewer(props: DataViewerProps) {
	const {
		network,
		data,
		modes = ["parsed", "json"],
		defaultMode = modes[0],
		simple,
		copyToClipboard,
		isModal
	} = props;

	const [mode, setMode] = useState<DataViewerMode>(defaultMode);

	console.log("render");

	const copyToClipboardValue = useMemo(() => {
		if (Array.isArray(data) || typeof data === "object") {
			return JSON.stringify(data, null, 4);
		}

		return data;
	}, [data]);

	const jsonContent = useMemo(() => (
		<div css={{fontSize: 14}}>
			<DataViewerValueJson value={data} />
		</div>
	), [data]);

	const parsedContent = useMemo(() => (
		<DataViewerValueParsed network={network} value={data} />
	), [data]);

	return (
		<div
			css={[
				dataViewerStyle,
				isModal
					? modalDataViewerStyle
					: simple
						? simpleDataViewerStyle
						: embeddedDataViewerStyle
			]}
		>
			<div css={[controlsStyle, simple && simpleControlsStyle]}>
				{!simple &&
					<ToggleButtonGroup
						css={modeButtonsStyle}
						exclusive
						value={mode}
						onChange={(_, mode) => mode && setMode(mode)}
					>
						{modes.map(mode =>
							<ToggleButton key={mode} css={modeButtonStyle} value={mode}>
								{modeLabels[mode]}
							</ToggleButton>
						)}
					</ToggleButtonGroup>
				}
				{copyToClipboard && <CopyToClipboardButton value={copyToClipboardValue} css={copyButtonStyle} />}
				{!simple &&
					<DataViewerModalHandle {...props} defaultMode={mode} />
				}
			</div>
			<div css={scrollAreaStyle}>
				{mode === "json" && jsonContent}
				{mode === "parsed" && parsedContent}
			</div>
		</div>
	);
}

export default DataViewer;
