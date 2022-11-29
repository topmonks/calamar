import styled from "@emotion/styled";

export const Card = styled.div`
	border-radius: 8px;
	box-shadow: 0px 0px 64px rgba(98, 151, 163, 0.13);
	padding: 24px;
	background-color: white;
	margin: 16px 0;

	${({theme}) => theme.breakpoints.up("md")} {
		padding: 48px;
	}
`;

export const CardHeader = styled.div`
	display: block;
	padding-bottom: 48px;
	align-items: center;

	font-weight: 700;
	font-size: 24px;
	line-height: 32px;

	word-break: break-all;

	[data-name=copy-button] {
		vertical-align: text-bottom;
		margin: 6px 0;
		margin-left: 16px;
	}
`;
