export type ExplorerSquidExtrinsic = {
	id: string;
	extrinsicHash: string;
	block: {
		id: string;
		hash: string;
		height: number;
		timestamp: string;
		specVersion: number;
	};
	mainCall: {
		callName: string;
		palletName: string;
	};
	indexInBlock: number;
	success: boolean;
	tip: string|null;
	fee: string|null;
	signerPublicKey: string|null;
	error: string|null;
	version: number;
}
