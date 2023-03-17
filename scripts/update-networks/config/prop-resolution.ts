import { SourceData, SourceType } from "../model";

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
