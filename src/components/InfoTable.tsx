/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import { css } from "@emotion/react";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { ErrorMessage } from "./ErrorMessage";

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
	loading?: boolean;
	notFound?: boolean;
	notFoundMessage?: string;
	error?: any;
	errorMessage?: string;
}>;

const InfoTable = (props: InfoTableProps) => {
	const {
		loading,
		notFound,
		notFoundMessage = "No item found",
		error,
		errorMessage = "Unexpected error occured while fetching data",
		children
	} = props;

	if (loading) {
		return <Loading />;
	}

	if (notFound) {
		return <NotFound>{notFoundMessage}</NotFound>;
	}

	if (error) {
		return (
			<ErrorMessage
				message={errorMessage}
				details={error.message}
				showReported
			/>
		);
	}

	return (
		<TableContainer>
			<Table css={tableStyles}>{children}</Table>
		</TableContainer>
	);
};

export default InfoTable;
