export type Network = {
	name: string;
	displayName: string;
	icon: string|undefined;
	prefix: number|undefined;
	decimals: number|undefined;
	symbol: string|undefined;
	coinGeckoCoin: CoinGeckoCoin|undefined;
	squids: Record<string, string|undefined>;
	hasWarnings?: string[];
	hasErrors?: string[];
}

export enum SourceType {
	SS58_REGISTRY = "SS58_REGISTRY",
	RPC = "RPC",
	RUNTIME_SPEC = "RUNTIME_SPEC",
	ARCHIVE_REGISTRY = "ARCHIVE_REGISTRY"
}

export type SourceData = {
	type: SourceType;
} & Partial<Pick<Network, "prefix"|"decimals"|"symbol">>;

export type CoinGeckoCoin = {
	id: string;
	name: string;
	symbol: string;
}
