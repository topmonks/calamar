export interface RuntimeMetadataAutocomplete {
	type: "pallet" | "call" | "event";
	name: string;
	pallet?: string;
	networks: string[];
}
