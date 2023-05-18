export const squidTypes = ["archive", "balances", "explorer", "main", "main-identites", "stats"] as const;

export const squidUrlTemplates: Record<string, (network: string) => string> = {
	balances: (network: string) => `https://squid.subsquid.io/${network}-balances/graphql`,
	explorer: (network: string) => `https://squid.subsquid.io/gs-explorer-${network}/graphql`,
	main: (network: string) => `https://squid.subsquid.io/gs-main-${network}/graphql`,
	stats: (network: string) => `https://squid.subsquid.io/gs-stats-${network}/graphql`
};

export const forceSquidUrl: Record<string, Partial<Record<typeof squidTypes[number], string>>> = {
	"kusama": {
		"main-identites": "https://squid.subsquid.io/gs-main-kusama-beta/v/v3/graphql"
	},
	"polkadot": {
		"stats": "https://squid.subsquid.io/gs-stats-polkadot/v/v1122/graphql"
	}
};
