export type Block = {
	id: string;
	hash: string;
	height: number;
	timestamp: string;
	parentHash: string;
	validator: string|null;
	specVersion: number;
}
