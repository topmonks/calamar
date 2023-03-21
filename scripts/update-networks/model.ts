export type Network = {
	name: string;
	displayName: string;
	icon: string|undefined;
	prefix: number|undefined;
	decimals: number|undefined;
	symbol: string|undefined;
	squids: Record<string, string|undefined>;
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
