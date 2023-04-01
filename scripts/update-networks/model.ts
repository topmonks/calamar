export type Network = {
	name: string;
	displayName: string;
	icon: string|undefined;
	color: string|undefined;
	website: string|undefined;
	parachainId: number|undefined;
	relayChain: string|undefined;
	prefix: number|undefined;
	decimals: number|undefined;
	symbol: string|undefined;
	coinGeckoCoin: CoinGeckoCoin|undefined;
	squids: Record<string, string|undefined>;
	hasWarnings?: string[];
	hasErrors?: string[];
}

export enum SourceType {
	ARCHIVE_REGISTRY = "ARCHIVE_REGISTRY",
	POLKADOT_JS = "POLKADOT_JS",
	RUNTIME_SPEC = "RUNTIME_SPEC",
	SS58_REGISTRY = "SS58_REGISTRY",
}

export type NetworkResolvableProps = Omit<Network, "name"|"displayName"|"squids"|"hasWarnings"|"hasErrors">;

export type SourceData = {
	type: SourceType;
} & Partial<NetworkResolvableProps>;

export type CoinGeckoCoin = {
	id: string;
	name: string;
	symbol: string;
}
