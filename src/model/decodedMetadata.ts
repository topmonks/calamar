export type DecodedCall = {
	name: string;
}

export type DecodedEvent = {
	name: string;
}

export type DecodedPallet = {
	name: string;
	calls: DecodedCall[];
	events: DecodedEvent[];
}

export type DecodedMetadata = {
	pallets: DecodedPallet[];
}
