/** @jsxImportSource @emotion/react */
import { PropsWithChildren } from "react";
import { Table, TableContainer } from "@mui/material";
import { css, Theme } from "@emotion/react";

import Loading from "./Loading";
import NotFound from "./NotFound";
import { ErrorMessage } from "./ErrorMessage";

const tableStyles = (theme: Theme) => css`
	table-layout: fixed;
	//min-width: 860px;

	& > tbody {
		& > tr {
			& > td,
			& > th {
				position: relative;
				vertical-align: top;
				line-height: 24px;

				&:first-child {
					width: 200px;
					padding-left: 0;
					font-weight: 700;
				}

				&:not(:first-child) {
					word-break: break-all;
				}

				&:first-child {
				}

				&:last-child {
					padding-right: 0;
				}

				> img {
					&:only-child {
						display: block;
					}
				}
			}
		}
	}

	${theme.breakpoints.down("sm")} {
		&,
		& > tbody,
		& > tbody > tr,
		& > tbody > tr > td,
		& > tbody > tr > th {
			display: block;
		}

		& > tbody > tr > td {
			padding-left: 0;
			padding-right: 0;

			&:first-child {
				width: auto;
				padding-bottom: 0;
			}

			&:not(:last-child) {
				border-bottom: none;
			}
		}
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
