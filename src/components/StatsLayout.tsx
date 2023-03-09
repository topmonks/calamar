/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

export const StatsLayout = styled.div`
    display: grid;
    width: 100%;
    height: auto;

    gap: 10px;

    grid-template-columns: repeat(4, auto);

    @media (max-width: 1300px) {
        grid-template-columns: repeat(2, auto);
	}

`;

const Stat = styled.div`
    min-width: 100px;
    width: 100%;
    height: 64px;
    display: flex;
`;

const StatIcon = styled.img`
    width: 64px;
    height: 64px;
    margin-right: 10px;
`;

const StatTitle = styled.div`
    font-weight: 500;
    margin-top: auto;
`;

const StatValue = styled.div`
    height: 32px;
    font-weight: 900;
`;

export type StatItemProps = {
	title: string;
	value?: string | number;
};

export function StatItem (props: StatItemProps) {
	const {
		title,
		value,
	} = props;
    
	return (
		<Stat>
			<StatIcon />
			<div style={{display: "flex", flexDirection: "column"}}>
				<StatTitle>{title}</StatTitle>
				<StatValue>{value}</StatValue>
			</div>
		</Stat>
	);
}