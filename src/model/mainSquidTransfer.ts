export type MainSquidTransfer = {
	id: string;
	direction: string;
	account: {
		id: string;
	};
	transfer: {
		blockNumber: number;
		timestamp: string;
		extrinsicHash: string;
		from: {
			id: string;
		};
		to: {
			id: string;
		};
		amount: number;
		success: boolean;
	}
}
