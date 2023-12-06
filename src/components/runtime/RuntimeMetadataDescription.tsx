/** @jsxImportSource @emotion/react */
import Markdown from "react-markdown";
import { css } from "@emotion/react";

const descriptionStyle = (darkMode?: boolean) => css`
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
		border-radius: 8px;
		font-size: 14px;
		line-height: 20px;

		${!darkMode && css`background-color: rgba(0, 0, 0, .065);`}
		${darkMode && css`background-color: rgba(255, 255, 255, .2);`}
	}

	h1, h2, h3, h4, h5, h6 {
		font-size: 16px;
	}
`;

const lineClampStyle = (lines: number ) => css`
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: ${lines};
	overflow: hidden;
`;

export interface RuntimeMetadataDescription {
	lineClamp?: number;
	darkMode?: boolean;
	className?: string;
	children: string;
}

export const RuntimeMetadataDescription = (props: RuntimeMetadataDescription) => {
	const {lineClamp, darkMode, className, children} = props;

	const text = children;

	return (
		<Markdown
			className={className}
			css={[
				descriptionStyle(darkMode),
				lineClamp && lineClampStyle(lineClamp)
			]}
			disallowedElements={["a"]}
			unwrapDisallowed
		>
			{text.replace(/\n/, "&nbsp;\n")}
		</Markdown>
	);
};
