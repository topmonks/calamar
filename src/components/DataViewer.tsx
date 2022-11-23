/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { css, Theme } from "@emotion/react";

import { DataViewerValueTable }  from "./DataViewerValueTable";
import { DataViewerValueJson } from "./DataViewerValueJson";
import { Button, ButtonGroup, IconButton, Modal, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Close, Fullscreen } from "@mui/icons-material";

const dataViewerStyle = css`
	display: inline-block;
	display: block;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	background-color: #f5f5f5;
	border-radius: 8px;
	padding: 12px;
	overflow: hidden;
	line-height: 24px;
	word-break: initial;
`;

const normalDataViewerStyle = (theme: Theme) => css`
	max-width: 100%;
	max-height: 500px;

	${theme.breakpoints.down("sm")} {
		max-height: 250px;
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

	> * {
		background-color: rgba(0, 0, 0, .05);
		border-radius: 4px;
	}
`;

const modeButtonStyle = css`
	font-size: 14px;
	padding: 0 8px;
	border: none;
	line-height: 24px;
`;

const fullscreenButtonStyle = css`
	padding: 0;
	margin-left: auto;

	background-color: rgba(0, 0, 0, .05);
	border-radius: 4px;

	> svg {
		display: block;
	}
`;

const closeButtonStyle = css`
	position: absolute;
	top: 0;
	right: 0;
	margin: 12px;
	padding: 0;

	background-color: rgba(0, 0, 0, .05);
	border-radius: 4px;

	z-index: 10;

	> svg {
		display: block;
	}
`;

const modalDataViewerStyle = (theme: Theme) => css`
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

export type DataViewerMode = "json" | "parsed";

const modeLabels: Record<DataViewerMode, string> = {
	parsed: "Parsed",
	json: "Raw"
};

export type DataViewerProps = {
	data: any;
	modes?: DataViewerMode[];
	defaultMode?: DataViewerMode;
	controls?: boolean;
	isModal?: boolean;
};

const DataViewerModalHandle = (props: DataViewerProps) => {
	const {isModal} = props;

	const [showModal, setShowModal] = useState<boolean>(false);

	if (isModal) {
		return null;
	}

	return (
		<>
			<IconButton css={fullscreenButtonStyle} onClick={() => setShowModal(true)}>
				<Fullscreen />
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
		data,
		modes = ["parsed", "json"],
		defaultMode = modes[0],
		controls,
		isModal
	} = props;

	const [mode, setMode] = useState<DataViewerMode>(defaultMode);

	console.log("render");

	const jsonContent = useMemo(() => (
		<div css={scrollAreaStyle}>
			<div css={{fontSize: 14}}>
				<DataViewerValueJson value={data} />
			</div>
		</div>
	), [data]);

	const parsedContent = useMemo(() => (
		<div css={scrollAreaStyle}>
			<DataViewerValueTable value={data} />
		</div>
	), [data]);

	return (
		<div css={[dataViewerStyle, isModal ? modalDataViewerStyle : normalDataViewerStyle]}>
			{controls &&
				<div css={controlsStyle}>
					<ToggleButtonGroup
						exclusive
						value={mode}
						onChange={(_, mode) => setMode(mode)}
					>
						{modes.map(mode =>
							<ToggleButton key={mode} css={modeButtonStyle} value={mode}>
								{modeLabels[mode]}
							</ToggleButton>
						)}
					</ToggleButtonGroup>
					<DataViewerModalHandle {...props} defaultMode={mode} />
				</div>
			}
			{mode === "json" && jsonContent}
			{mode === "parsed" && parsedContent}
		</div>
	);
}

export default DataViewer;
