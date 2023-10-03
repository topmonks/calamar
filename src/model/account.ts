import { AccountIdentity } from "./accountIdentity";

export type Account = {
	id: string;
	address: string;
	identity: AccountIdentity | null;
}
