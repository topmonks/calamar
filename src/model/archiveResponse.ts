export type ArchiveResponse<T = any> = {
	data?: T;
	error?: {
		message: string;
	}
}
