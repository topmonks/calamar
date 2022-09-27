import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import ParamsValue from "./ParamValue";

const Params = styled.div`
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

	const [showExpand, setShowExpand] = useState<boolean>(false);
	const [expand, setExpand] = useState<boolean>(false);

	console.log(args);
	const argsArray: any[] = useMemo(
		() => (Array.isArray(args) ? args : [args]),
		[args]
	);

	return (
		<>
			<Params>
				<div
					style={{
						maxHeight: 500,
						overflow: "auto",
						position: "relative",
					}}
				>
					<ParamsValue value={argsArray} />
				</div>
			</Params>
		</>
	);
}

export default ParamsTable;
