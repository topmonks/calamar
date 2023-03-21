import { SourceData, SourceType } from "./model";

export const squidTypes = ["archive", "balances", "explorer", "main", "stats"];

export const ss58RegistryNetworkNames: Record<string, string> = {
	"gemini-2a-testnet": "subspace_testnet",
	"gmordie": "gm",
	"invarch-tinkernet": "tinker",
	"khala": "phala",
	"quartz": "quartz_mainnet",
	"snow": "SNOW",
	"unique": "unique_mainnet",
	"xx-network": "xxnetwork"
};

export const rpcNewtorkNames: Record<string, string> = {
	"gemini-2a-testnet": "subspace-gemini-2a",
	"gmordie": "gm",
	"hydradx": "hydra",
	"invarch-tinkernet": "tinker",
	"moonbase": "moonbaseAlpha",
	"subsocial": "subsocialX",
};

export const archiveRegistryArchiveNetworkNames: Record<string, string> = {
	"subsocial": "subsocial-parachain"
};

export const forceSource: Record<string, Partial<Record<keyof SourceData, SourceType>>> = {
	"equilibrium": {
		"symbol": SourceType.SS58_REGISTRY
	},
	"gemini-2a-testnet": {
		"symbol": SourceType.SS58_REGISTRY
	},
	"karura": {
		"symbol": SourceType.SS58_REGISTRY
	},
	"peaq": {
		"prefix": SourceType.SS58_REGISTRY
	}
};

export const squidUrlTemplates: Record<string, (network: string) => string> = {
	balances: (network: string) => `https://squid.subsquid.io/${network}-balances/graphql`,
	explorer: (network: string) => `https://squid.subsquid.io/gs-explorer-${network}/graphql`,
	main: (network: string) => `https://squid.subsquid.io/gs-main-${network}/graphql`,
	stats: (network: string) => `https://squid.subsquid.io/gs-stats-${network}/graphql`
};

export const forceSquidUrl: Record<string, Record<string, string>> = {
	"kusama": {
		"stats": "https://squid.subsquid.io/chain-analytics-squid/v/kusama-multi-parallel-2-0/graphql"
	},
	"polkadot": {
		"stats": "https://squid.subsquid.io/chain-analytics-squid/v/polkadot-multi-parallel-2-0/graphql"
	}
};
