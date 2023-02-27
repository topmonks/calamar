import { RuntimeSpec } from "./runtimeSpec";

export type Balance = {
	id: string;
	free: number;
	reserved: number;
	total: number;
	updatedAt: number;
	runtimeSpec: RuntimeSpec;
}
