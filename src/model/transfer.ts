export type Transfer = {
	id: string;
	direction: string;
	accountId: string;
	blockNumber: number;
	timestamp: string;
	extrinsicHash: string;
	fromId: string;
	toId: string;
	amount: number;
	success: boolean;
}
