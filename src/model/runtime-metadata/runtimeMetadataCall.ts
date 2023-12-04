import { RuntimeMetadataArg } from "./runtimeMetadataArg";

export interface RuntimeMetadataCall {
	network: string;
	specVersion: string;
	pallet: string;
	name: string;
	args: RuntimeMetadataArg[];
	description: string;
}
