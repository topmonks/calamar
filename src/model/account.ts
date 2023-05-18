import { AccountIdentity } from "./accountIdentity";
import { RuntimeSpec } from "./runtimeSpec";

export type Account = {
	id: string;
	address: string;
	identity: AccountIdentity | null;
	runtimeSpec: RuntimeSpec
}
