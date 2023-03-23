import { CustomError } from "ts-custom-error";

export class DataError extends CustomError {
	constructor(message: string) {
		super(message);
	}
}
