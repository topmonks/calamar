import styled from "@emotion/styled";

export const Card = styled.div`
	border-radius: 8px;
	box-shadow: 0px 0px 64px rgba(98, 151, 163, 0.13);
	padding: 24px;
	background-color: white;
	margin: 16px 0;

	@media (min-width: 900px) {
		padding: 48px;
	}
`;

export const CardHeader = styled.div`
	padding-bottom: 48px;

	font-weight: 700;
	font-size: 24px;
	line-height: 33px;
`;
