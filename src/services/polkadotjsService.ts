import { ApiPromise, WsProvider } from "@polkadot/api";
import { wssEndpoints } from "../constants/polkadotjsWssEndpoints";

export const chains: Record<string, string> = {
	acala: "acala",
	"aleph-zero-testnet": "aleph-zero-testnet",
	astar: "astar",
	bajun: "bajun",
	bifrost: "bifrost",
	calamari: "calamari",
	crust: "crust",
	efinity: "efinity",
	equilibrium: "equilibrium",
	"gear-testnet": "gear", // currently missing
	gmordie: "gm",
	hydradx: "hydra",
	interlay: "interlay",
	"invarch-tinkernet": "tinker",
	karura: "karura",
	khala: "khala",
	kintsugi: "kintsugi",
	kusama: "kusama",
	litentry: "litentry",
	litmus: "litmus",
	moonbase: "moonbaseAlpha",
	moonbeam: "moonbeam",
	moonriver: "moonriver",
	opal: "opal",
	peaq: "peaq", // currently missing
	phala: "phala",
	polkadot: "polkadot",
	quartz: "quartz",
	rococo: "rococo",
	shibuya: "shibuya",
	shiden: "shiden",
	statemine: "statemine",
	statemint: "statemint",
	"subsocial-parachain": "subsocial",
	unique: "unique",
};

export function getWssEndpoint(network: string) {
	const endpoint = wssEndpoints.find((data) => data.info === chains[network]);

	return Object.values(endpoint?.providers || {})[0]; 
}

export type Account = any;

export async function getAccount(network: string, address: string) {
	const wsProvider = new WsProvider(getWssEndpoint(network));
	const api = await ApiPromise.create({ provider: wsProvider });

	// Retrieve the account balance & nonce via the system module
	const data: Account = await api.query.system.account(address);
	data.address = address;

	// return the account data only if the account is active
	// Source: https://substrate.stackexchange.com/questions/263/what-is-the-meaning-of-the-account-provider-sufficients-and-consumer
	if (data.providers > 0 || data.sufficients > 0 || data.consumers > 0) {
		return data;
	}

	return undefined;
}

export async function isAccount(network: string, address: string) {
	const accountData = await getAccount(network, address);
	return accountData !== undefined;
}