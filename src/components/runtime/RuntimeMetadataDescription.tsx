/** @jsxImportSource @emotion/react */
import Markdown from "react-markdown";
import { css } from "@emotion/react";

const descriptionStyle = css`
	padding: 16px;
	padding: 0;;
	height: 100%;
	max-width: 100%;

	border-radius: 8px;

	line-height: 24px;

	word-break: normal;

	> p {
		margin: 0;
		margin-bottom: 16px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	code {
		padding: 2px 6px;
		background-color: #f5f5f5;
		background-color: rgba(0, 0, 0, .065);
		border-radius: 8px;
		font-size: 14px;
		line-height: 20px;
	}

	h1, h2, h3, h4, h5, h6 {
		font-size: 16px;
	}
`;

const ellipsisStyle = css`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
`;

export interface RuntimeMetadataDescription {
	onlyLine?: number;
	ellipsis?: boolean;
	className?: string;
	children: string;
}

export const RuntimeMetadataDescription = (props: RuntimeMetadataDescription) => {
	const {onlyLine, ellipsis, className, children} = props;

	let text = children;

	if (onlyLine) {
		const lines = children.split("\n");
		text = lines[onlyLine - 1] as string;

		if (ellipsis && lines.length > 1) {
			text += " …";
		}
	}

	return (
		<Markdown
			className={className}
			css={[
				descriptionStyle,
				ellipsis && ellipsisStyle
			]}
			disallowedElements={["a"]}
			unwrapDisallowed
		>
			{text}
		</Markdown>
	);
};
