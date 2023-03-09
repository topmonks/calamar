import { Resource } from "../../model/resource";
import { Stats } from "../../model/stats";

export type StatsGraphProps = {
	stats: Resource<Stats>;
}

export const StatsGraph = (props: StatsGraphProps) => {
	const {stats} = props;

	// This is temporary
	return (
		<div style={{ margin: "auto",backgroundColor: "Gray", width: "300px", textAlign: "center" }}>
            Graph
		</div>
	);
};
