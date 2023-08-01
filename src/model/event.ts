export interface EventResponse {
	id: string;
	module: string;
	event: string;
	blockHeight: bigint;
	data: string;
	extrinsicId: string | null;
}

export interface Event extends Omit<EventResponse, "data"> {
	data: string[];
}