import { SourceData } from "../model";
import { log } from "./log";

export function checkSourceData(data: SourceData, checkProps: (keyof Omit<SourceData, "type">)[]) {
	for(const prop of checkProps) {
		if (data[prop] === undefined) {
			log(log.warn, `${data.type} source: Missing ${prop}`);
		}
	}
}
