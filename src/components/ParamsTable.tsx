/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
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

const paramsScrollAreaStyle = css`
	position: relative;
	max-height: 500px;
	overflow: auto;
`;

export type EventParamsTableProps = {
	args: any;
};

function ParamsTable(props: EventParamsTableProps) {
	const { args } = props;

	const argsArray: any[] = useMemo(
		() => (Array.isArray(args) ? args : [args]),
		[args]
	);

	return (
		<div css={paramsStyle}>
			<div css={paramsScrollAreaStyle}>
				<ParamsValue value={argsArray} />
			</div>
		</div>
	);
}

export default ParamsTable;
