import React, { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";

import Loading from "./Loading";
import NotFound from "./NotFound";

export type InfoTableProps = PropsWithChildren<{
	item: any;
	loading?: boolean;
	noItemMessage?: string;
}>;

const InfoTable = (props: InfoTableProps) => {
	const { item, loading, noItemMessage = "No item found", children } = props;

	if (loading) {
		return <Loading />;
	}

	if (!item) {
		return <NotFound>{noItemMessage}</NotFound>;
	}

	return (
		<TableContainer>
			<Table className="calamar-info-table">{children}</Table>
		</TableContainer>
	);
};

export default InfoTable;
