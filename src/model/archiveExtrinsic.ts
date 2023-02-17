export type ArchiveExtrinsic = {
	id: string;
	hash: string;
	call: {
		name: string;
		args: object|null;
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
	signature: any|null;
	indexInBlock: number;
	success: boolean;
	tip: string|null;
	fee: string|null;
	error: object|null;
	version: number;
}
