import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import styled from "@emotion/styled";

const ValueTable = styled(Table)`
	width: 100%;
	word-break: initial;

	th, td > & {
		//margin: -6px 0px;
	}

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

const ParamIndexCell = styled(TableCell)`
	width: 60px;
`;

const ParamNameCell = styled(TableCell)`
	width: 180px;
`;

const ParamIndex = styled.div`
	font-weight: 300;
	word-break: break-all;
	box-sizing: border-box;
	width: 60px;
	padding: 6px 0;
	padding-right: 16px;
`;

const ParamName = styled.div`
	font-weight: 700;
	word-break: break-all;
	box-sizing: border-box;
	width: 180px;
	padding: 6px 0;
	padding-right: 32px;
`;

const ParamValue = styled.div`
	word-break: break-all;
	min-width: 100px;
	max-width: 550px;
	padding: 6px 0;
`;

export type EventParamValueProps = {
	value: any;
};

function ParamsValue(props: EventParamValueProps) {
	let { value } = props;

	if (Array.isArray(value) && value.length > 0) {
		return (
			<ValueTable size="small">
				<TableBody>
					{value.map((item, index) => (
						<TableRow key={index}>
							<ParamIndexCell>
								<ParamIndex>{index}</ParamIndex>
							</ParamIndexCell>
							<TableCell>
								<ParamsValue value={item} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</ValueTable>
		);
	} else if (Array.isArray(value) && value.length === 0) {
		value = "[ ]";
	} else if (value && typeof value === "object") {
		const keys = Object.keys(value);
		keys.sort();

		return (
			<ValueTable size="small">
				<TableBody>
					{keys.map((key) => (
						<TableRow key={key}>
							<ParamNameCell>
								<ParamName>{key}</ParamName>
							</ParamNameCell>
							<TableCell>
								<ParamsValue value={value[key]} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</ValueTable>
		);
	} else if (typeof value === "boolean") {
		value = value ? "true" : "false";
	}

	return <ParamValue>{value}</ParamValue>;
}

export default ParamsValue;
