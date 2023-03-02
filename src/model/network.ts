export type Network = {
	name: string;
	displayName: string;
	icon: string;
	prefix: number;
	decimals: number;
	symbol: string;
	squids: Record<string, string|undefined>;
}
