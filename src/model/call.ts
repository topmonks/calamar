import { RuntimeSpec } from "./runtimeSpec";

export type Call = {
	id: string;
	name: string;
	success: boolean;
	origin?: any;
	args?: any;
	block: {
		id: string;
		height: number;
		timestamp: string;
		spec: {
			specVersion: number;
		}
	};
	parent: {
		id: string;
		name: string;
	};
	extrinsic: {
		id: string;
		version: number;
	}
	runtimeSpec: RuntimeSpec;
}
