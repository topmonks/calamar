/** @jsxImportSource @emotion/react */
import { HTMLAttributes, PropsWithChildren } from "react";
import { css } from "@emotion/react";

const cardStyle = css`
	border-radius: 8px;
	box-shadow: 0px 0px 64px rgba(98, 151, 163, 0.13);
	padding: 24px;
	background-color: white;
	margin: 16px 0;

	@media (min-width: 900px) {
		padding: 48px;
	}
`;

export type CardProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const Card = (props: CardProps) => {
	const {children, ...restProps} = props;

	return <div css={cardStyle} {...restProps}>{children}</div>;
};

export default Card;
