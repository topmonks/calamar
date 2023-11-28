import { CustomError } from "ts-custom-error";
import { getReasonPhrase } from "http-status-codes";

import { Network } from "../model/network";

export class NonFatalError extends CustomError {
	constructor(message: string) {
		super(message);
	}
}

export class DataError extends NonFatalError {
	constructor(message: string) {
		super(message);
	}
}

export class FetchError extends NonFatalError {
	constructor(
		public readonly url: string,
		public readonly code: number
	) {
		super(`Cannot fetch ${url}: HTTP ${code} (${getReasonPhrase(code)})`);
	}
}

export class NetworkError extends NonFatalError {
	constructor(
		public readonly network: Network,
		public readonly error: any
	) {
		super(`${network.displayName}: ${"message" in error ? error.message : "Unknown error"}`);
	}
}
