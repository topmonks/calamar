export type ArchiveCall = {
	id: string;
	name: string;
	success: boolean;
	origin: any|null;
	args: any|null;
	block: {
		id: string;
		height: number;
		timestamp: string;
		spec: {
			specVersion: number;
		}
	};
	parent: {
		id: string;
	}|null;
	extrinsic: {
		id: string;
		indexInBlock: number;
	}
}
