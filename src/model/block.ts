import { RuntimeSpec } from "./runtimeSpec";

export type Block = {
	id: string;
	hash: string;
	height: number;
	timestamp: string;
	parentHash: string;
	validator?: string;
	spec: {
		specVersion: number;
	};
	runtimeSpec: RuntimeSpec;
}
