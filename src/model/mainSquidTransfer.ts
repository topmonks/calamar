export type MainSquidTransfer = {
	id: string;
	direction: string;
	account: {
		publicKey: string;
	};
	transfer: {
		blockNumber: number;
		timestamp: string;
		extrinsicHash: string;
		from: {
			publicKey: string;
		};
		to: {
			publicKey: string;
		};
		amount: number;
		success: boolean;
	}
}
