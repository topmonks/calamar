export type DecodedArg = {
	name: string;
	type: string;
	typeName?: string;
}

export type DecodedCall = {
	name: string;
	args: DecodedArg[];
}

export type DecodedEvent = {
	name: string;
	args: DecodedArg[];
}

export type DecodedPallet = {
	name: string;
	calls: DecodedCall[];
	events: DecodedEvent[];
}

export type DecodedMetadata = {
	ss58Prefix: number;
	pallets: DecodedPallet[];
}
