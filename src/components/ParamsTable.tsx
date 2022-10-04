/** @jsxImportSource @emotion/react */

import React, { useMemo, useState } from "react";
import { css } from "@emotion/react";

import ParamsValue from "./ParamValue";

const paramsStyle = css`
	display: inline-block;
	box-sizing: border-box;
	background-color: #f5f5f5;
	border-radius: 8px;
	padding: 12px;
	max-width: 100%;

	> div > table {
		margin: 0 12px;
		width: auto;//calc(100% - 24px);
	}
`;

export type EventParamsTableProps = {
	args: any;
};

function ParamsTable(props: EventParamsTableProps) {
	const { args } = props;

	console.log(args);
	const argsArray: any[] = useMemo(
		() => (Array.isArray(args) ? args : [args]),
		[args]
	);

	return (
		<>
			<div css={paramsStyle}>
				<div
					style={{
						maxHeight: 500,
						overflow: "auto",
						position: "relative",
					}}
				>
					<ParamsValue value={argsArray} />
				</div>
			</div>
		</>
	);
}

export default ParamsTable;
