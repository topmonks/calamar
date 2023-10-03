import { RuntimeMetadataArg } from "./runtimeMetadataArg";

export interface RuntimeMetadataEvent {
	network: string;
	specVersion: number;
	pallet: string;
	name: string;
	args: RuntimeMetadataArg[];
}
