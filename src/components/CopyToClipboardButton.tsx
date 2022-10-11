import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

export type CopyToClipboardButtonProps = {
	value: string;
}

const CopyToClipboardButton = (props: CopyToClipboardButtonProps) => {
	const {value} = props;

	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(value);

		setCopied(true);
		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<>
			<Tooltip
				arrow
				disableHoverListener
				open={copied}
				placement="top"
				title="Copied"
			>
				<IconButton onClick={copyToClipboard}>
					<svg
						height="24"
						style={{ color: "#14A1C0" }}
						viewBox="0 0 24 24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18 6v-6h-18v18h6v6h18v-18h-6zm-12 10h-4v-14h14v4h-10v10zm16 6h-14v-14h14v14z"
							fill="currentColor"
						/>
					</svg>
				</IconButton>
			</Tooltip>
		</>
	);
};
export default CopyToClipboardButton;
