export type ArchiveEvent = {
	id: string;
	name: string;
	block: {
		id: string;
		height: number;
		timestamp: string;
		spec: {
			specVersion: number;
		}
	};
	extrinsic: {
		id: string;
	} | null
	call: {
		id: string;
	} | null
	args: any|null;
}
