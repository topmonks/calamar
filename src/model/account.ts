import { AccountIdentity } from "./accountIdentity";
import { Network } from "./network";

export type Account = {
	id: string;
	network: Network;
	address: string;
	identity: AccountIdentity | null;
}
