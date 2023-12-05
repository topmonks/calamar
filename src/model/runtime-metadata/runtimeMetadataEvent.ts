import { RuntimeMetadataArg } from "./runtimeMetadataArg";

export interface RuntimeMetadataEvent {
	network: string;
	specVersion: string;
	pallet: string;
	name: string;
	args: RuntimeMetadataArg[];
	description: string;
}
