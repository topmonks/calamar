import { RuntimeMetadataArg } from "./runtimeMetadataArg";

export interface RuntimeMetadataCall {
	network: string;
	specVersion: number;
	pallet: string;
	name: string;
	args: RuntimeMetadataArg[];
}
