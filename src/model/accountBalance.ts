export type AccountBalance = {
	id: string;
	network: string;
	encodedAddress?: string;
	ss58prefix?: number;
	balanceSupported: boolean;
	balance?: {
		free: number;
		reserved: number;
		total: number;
		updatedAt?: number;
	},
	error?: any
}
