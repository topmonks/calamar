export type Archive = {
	network: string;
	providers: {
		provider: string;
		dataSourceUrl: string;
		explorerUrl: string;
		release: string;
		image: string;
		gateway: string;
	}[];
	genesisHash: string;
};
