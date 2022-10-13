/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import { css } from "@emotion/react";

import Loading from "./Loading";
import NotFound from "./NotFound";

const tableStyles = css`
	table-layout: fixed;
	min-width: 860px;

	td, th {
		vertical-align: top;
		line-height: 24px;
	}

	td {
		&:first-child {
			padding-left: 0;
		}

		&:last-child {
			padding-right: 0;
		}

		&:not(:first-child) {
			word-break: break-all;
		}

		> img {
			&:only-child {
				display: block;
			}
		}
	}

	& > tbody > tr > td:first-child {
		width: 200px;
		font-weight: 700;
		padding-left: 0;
	}
`;

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
			<Table css={tableStyles}>{children}</Table>
		</TableContainer>
	);
};

export default InfoTable;
