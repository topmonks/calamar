export type ExplorerSquidEvent = {
	id: string;
	eventName: string;
	palletName: string;
	block: {
		id: string;
		height: number;
		timestamp: string;
		specVersion: number;
	};
	extrinsic: {
		id: string;
	} | null;
	call: {
		id: string;
	} | null;
}
