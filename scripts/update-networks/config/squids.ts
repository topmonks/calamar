export const squidTypes = ["archive", "explorer", "main", "identites", "stats"] as const;

export const squidUrlTemplates: Record<string, (network: string) => string> = {
	explorer: (network: string) => `https://squid.subsquid.io/gs-explorer-${network}/graphql`,
	main: (network: string) => `https://squid.subsquid.io/gs-main-${network}/graphql`,
	stats: (network: string) => `https://squid.subsquid.io/gs-stats-${network}/graphql`
};

export const forceSquidUrl: Record<string, Partial<Record<typeof squidTypes[number], string>>> = {
	"kusama": {
		"identites": "https://squid.subsquid.io/gs-main-kusama/graphql"
	},
	"polkadot": {
		"identites": "https://squid.subsquid.io/gs-main-polkadot/graphql"
	},
};
