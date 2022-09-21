import React, { useMemo } from "react";
import { Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import EventParamRows from "./EventParamRows";

const ParamsTable = styled(Table)`
	background-color: #f5f5f5;
	td,
	th {
		vertical-align: top;
	}
`;

export type EventParamsTableProps = {
	args: any;
};

function EventParamsTable(props: EventParamsTableProps) {
	const { args } = props;

	console.log(args);
	const argsArray: any[] = useMemo(
		() => (Array.isArray(args) ? args : [args]),
		[args]
	);

	return (
		<TableContainer
			component={Paper}
			elevation={0}
			style={{ maxWidth: "100%", width: "fit-content", borderRadius: 8 }}
		>
			<ParamsTable size="small">
				<TableBody>
					{argsArray.map((arg, index) => (
						<EventParamRows index={index} key={index} param={arg} />
					))}
				</TableBody>
			</ParamsTable>
		</TableContainer>
	);
}

export default EventParamsTable;
