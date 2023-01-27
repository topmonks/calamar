import { RuntimeSpec } from "./runtimeSpec";

export type Event = {
	id: string;
	name: string;
	block: {
		id: string;
		height: number;
		timestamp: string;
		spec: {
			specVersion: number;
		}
	};
	extrinsic: {
		id: string;
	}
	call: {
		id: string;
	}
	args?: any;
	runtimeSpec: RuntimeSpec;
}
