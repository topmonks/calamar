import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Paper, Table, TableBody, TableContainer } from "@mui/material";
import styled from "@emotion/styled";

import EventParamRows from "./EventParamRows";

const ParamsTable = styled(Table)`
  background-color: #f5f5f5;
  border-radius: 8px;

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

	const [showExpand, setShowExpand] = useState<boolean>(false);
	const [expand, setExpand] = useState<boolean>(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	console.log(args);
	const argsArray: any[] = useMemo(
		() => (Array.isArray(args) ? args : [args]),
		[args]
	);

	useEffect(() => {
		console.log("W", wrapperRef);
		if (wrapperRef.current!.clientHeight < wrapperRef.current!.scrollHeight) {
			setShowExpand(true);
		}
	}, []);

	return (
		<>
			<TableContainer
				component={Paper}
				elevation={0}
				style={{ maxWidth: "100%", width: "fit-content", borderRadius: 8 }}
			>
				<div
					ref={wrapperRef}
					style={{
						maxHeight: expand ? "none" : 500,
						backgroundColor: "white",
						overflow: "hidden",
						zIndex: 0,
						position: "relative",
					}}
				>
					<ParamsTable size="small">
						<TableBody>
							{argsArray.map((arg, index) => (
								<EventParamRows index={index} key={index} param={arg} />
							))}
						</TableBody>
					</ParamsTable>
				</div>
				<div
					style={{
						backgroundColor: "white",
						boxShadow: expand ? "none" : "0 0 20px 20px white",
						zIndex: 1,
						position: "relative",
						textAlign: "center",
						marginTop: expand ? 0 : -25,
						padding: 8,
					}}
				>
					<Button onClick={() => setExpand(!expand)} variant="outlined">
						{expand ? "Collapse" : "Expand"}
					</Button>
				</div>
			</TableContainer>
		</>
	);
}

export default EventParamsTable;
