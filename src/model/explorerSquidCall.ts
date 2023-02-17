export type ExplorerSquidCall = {
	id: string;
	callName: string;
	palletName: string;
	success: boolean;
	callerPublicKey: string|null;
	parentId: string|null;
	block: {
		id: string;
		height: number;
		timestamp: string;
		specVersion: number;
	};
	extrinsic: {
		id: string;
	}
}
