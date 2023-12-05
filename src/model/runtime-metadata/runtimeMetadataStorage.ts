export interface RuntimeMetadataStorage {
	network: string;
	specVersion: string;
	pallet: string;
	name: string;
	args?: string[];
	returnType: string;
	description: string;
}
