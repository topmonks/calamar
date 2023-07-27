import { useResource } from "./useResource";
import {ApiPromise, WsProvider } from "@polkadot/api";
import { NETWORK_CONFIG, RPC_ENDPOINT } from "../config";
import Decimal from "decimal.js";
import { Balance } from "../model/balance";

let api: any;

export function useBalance(address: string) {
	return useResource(fetchBalance, [address]);
}

const connectApi = async () => {
	try {
		const wsProvider = new WsProvider(RPC_ENDPOINT);
		const api = await ApiPromise.create({ provider: wsProvider });
		await api.isReady;
	}
	catch {
		throw new Error("Failed to initialize API");
	}

};

const fetchBalance = async (address: string): Promise<Balance> => { 
	if (!api) {
		await connectApi();
	}
	if (api) {
		const res = api.query.system.account(address);
		if (res.isEmpty) {
			return {
				total: new Decimal(0),
				reserved: new Decimal(0),
				free: new Decimal(0),
			} as Balance;
		} else {
			const data = res.toJSON();
			let unit = new Decimal(10);
			unit = unit.pow(NETWORK_CONFIG.decimals);

			return {
				total: new Decimal(data.total).div(unit),
				free: new Decimal(data.free).div(unit),
				reserved: new Decimal(data.reserved).div(unit),
			} as Balance;
		}
	} else {
		return {
			total: new Decimal(0),
			reserved: new Decimal(0),
			free: new Decimal(0),
		} as Balance;		
	}
};