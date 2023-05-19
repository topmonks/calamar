export type MainSquidTransfer = {
	id: string;
	direction: string;
	account: {
		publicKey: string;
	};
	transfer: {
		id: string;
		blockNumber: number;
		timestamp: string;
		extrinsicHash: string|null;
		from: {
			publicKey: string;
		};
		to: {
			publicKey: string;
		};
		amount: string;
		success: boolean;
	}
}
