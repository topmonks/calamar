/** @jsxImportSource @emotion/react */
import { useCallback, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { css } from "@emotion/react";

const buttonStyle = css`
	padding: 0;
	margin-left: 16px;
`;

export type CopyToClipboardButtonProps = {
	value?: string;
}

const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
	const {value} = props;

	const [copied, setCopied] = useState(false);

	const copyToClipboard = useCallback(async () => {
		if (!value) {
			return;
		}

		await navigator.clipboard.writeText(value);

		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	}, [value]);

	return (
		<Tooltip
			arrow
			disableHoverListener
			open={copied}
			placement="top"
			title="Copied"
		>
			<IconButton onClick={copyToClipboard} css={buttonStyle} data-name="copy-button">
				<svg
					height="20"
					viewBox="0 0 20 20"
					width="20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M15 5v-5h-15v15h5v5h15v-15h-5z m-10 8h-3v-11h11v3h-8v8z m13 5h-11v-11h11v11z"
						fill="currentColor"
					/>
				</svg>
			</IconButton>
		</Tooltip>
	);
};
export default CopyToClipboardButton;
