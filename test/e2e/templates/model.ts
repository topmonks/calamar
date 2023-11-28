import { SquidRequestOptions } from "../../utils/matchSquidRequest";

export type RequestDataType = "item" | "items" | "itemsConnection";

export interface RequestOptions extends SquidRequestOptions {
	queryProp: string|string[];
	dataType: RequestDataType;
}

export interface TestItem {
	name: string;
	requests: RequestOptions[];
}
