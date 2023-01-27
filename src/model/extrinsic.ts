import { RuntimeSpec } from "./runtimeSpec";

export type Extrinsic = {
	id: string;
	hash: string;
	call: {
		name: string;
		args?: any;
	};
	block: {
		id: string;
		hash: string;
		height: number;
		timestamp: string;
		spec: {
			specVersion: number;
		}
	};
	signature?: any;
	indexInBlock: number;
	success: boolean;
	tip?: number;
	fee?: number;
	error?: any;
	version: number;
	runtimeSpec: RuntimeSpec;
}
