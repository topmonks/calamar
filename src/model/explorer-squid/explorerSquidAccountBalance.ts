export type ExplorerSquidAccountBalance = {
	balance?: {
		free: string;
		reserved: string;
		total: string;
		updatedAt?: number;
	}
	chainInfo: {
		tokens: {
			decimals: string|null;
			symbol: string;
		}[];
	}
}
