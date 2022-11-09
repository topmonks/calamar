/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { Alert, AlertTitle } from "@mui/material";
import { css } from "@emotion/react";

const alertStyle = css`
	padding: 16px 22px;
`;

const reportedStyle = css`
	margin-top: 8px;
	font-size: 13px;
`;

const detailsStyle = css`
	margin-top: 12px;

	> pre {
		margin: 0;
		padding: 16px;
		padding-bottom: 0;
		font-size: 12;
	}
`;

export type ErrorMessageProps = {
	message: ReactNode;
	details?: ReactNode;
	showReported?: boolean;
}

export const ErrorMessage = (props: ErrorMessageProps) => {
	const {message, details, showReported} = props;

	return (
		<Alert severity="error" css={alertStyle}>
			<AlertTitle>{message}</AlertTitle>
			{showReported &&
				<div css={reportedStyle}>
					This error is logged. No need to report it.
				</div>
			}
			{details &&
				<details css={detailsStyle}>
					<summary>Details</summary>
					<pre>{details}</pre>
				</details>
			}
		</Alert>
	);
};
