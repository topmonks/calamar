/** @jsxImportSource @emotion/react */
import { ReactNode, useEffect, useMemo } from "react";
import { Alert, AlertProps, AlertTitle } from "@mui/material";
import { css } from "@emotion/react";
import { useRollbar } from "@rollbar/react";

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

export type ErrorMessageProps = AlertProps & {
	message: ReactNode;
	details?: unknown|unknown[];
	report?: boolean;
	showReported?: boolean;
}

export const ErrorMessage = (props: ErrorMessageProps) => {
	const {message, details, report, showReported = report, ...alertProps} = props;

	const rollbar = useRollbar();

	const errors = useMemo<unknown[]>(
		() => Array.isArray(details) ? details : details ? [details] : [],
		[details]
	);

	const detailsContent = useMemo(() => {
		return errors
			.map(it => it instanceof Error ? it.message : "Unknown error")
			.join("\n\n");
	}, [errors]);

	console.log("details", detailsContent);

	useEffect(() => {
		if (report) {
			errors.forEach(it => rollbar.error(it as any));
		}
	}, [errors, report, rollbar]);

	return (
		<Alert severity="error" css={alertStyle} data-test="error" {...alertProps}>
			<AlertTitle>{message}</AlertTitle>
			{showReported &&
				<div css={reportedStyle}>
					This error is logged. No need to report it.
				</div>
			}
			{detailsContent &&
				<details css={detailsStyle}>
					<summary>Details</summary>
					<pre>{detailsContent}</pre>
				</details>
			}
		</Alert>
	);
};
