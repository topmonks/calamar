import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TitleComponent, TooltipComponent } from "echarts/components";
import { SVGRenderer } from "echarts/renderers";

echarts.use([
	PieChart,
	TitleComponent,
	LegendComponent,
	TooltipComponent,
	SVGRenderer
]);
