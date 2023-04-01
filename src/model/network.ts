export type Network = {
	name: string;
	displayName: string;
	icon: string;
	color?: string;
	website?: string;
	parachainId?: number;
	relayChain?: string;
	prefix: number;
	decimals: number;
	symbol: string;
	squids: Record<string, string|undefined>;
	coinGeckoId?: string;
}
