import fs from "fs";
import path from "path";
import colors from "colors";
import archivesJson from "@subsquid/archive-registry/archives.json";

import { archiveRegistryArchiveNetworkNames } from "../config/archive-registry";
import { coinGeckoId } from "../config/coingecko";
import { forceValues } from "../config/prop-resolution";
import { forceSquidUrl, squidTypes, squidUrlTemplates } from "../config/squids";

import { CoinGeckoCoin, Network, NetworkResolvableProps, SourceData, SourceType } from "../model";

import { log } from "./log";

export function resolveIcon(network: Network) {
	const iconsPath = "assets/network-icons";
	const iconsDir = path.join(__dirname, "..", "..", "..", "public", iconsPath);

	const iconFilename = fs.readdirSync(iconsDir).find(it => it.startsWith(`${network.name}.`));

	if (iconFilename) {
		network.icon = `/${iconsPath}/${iconFilename}`;
	}
}

export function resolveProperty<K extends keyof NetworkResolvableProps>(network: Network, prop: K, sources: SourceData[], path: SourceType[], forceSource?: SourceType) {
	let value: Network[K] | undefined = undefined;

	if (prop in (forceValues[network.name] || {})) {
		log(log.warn, `Value for property ${prop} is forced`);
		value = forceValues[network.name]?.[prop];
	} else {
		const values = path.map(type => {
			const source = sources.find(source => source.type === type);
			if (!source) {
				throw new Error(`Source ${type} not found`);
			}

			return source[prop];
		});

		if (!allEqualOrUndefined(values)) {
			log(forceSource ? log.warn : log.error, `Source values of ${prop} differ`);
			for(const type of path) {
				log(`- ${type}:`.padEnd(20), sources.find(it => it.type === type)?.[prop]);
			}

			if (!forceSource) {
				return;
			}
		}

		value = values.filter(it => it !== undefined)[0] as Network[K];

		if (forceSource) {
			log(log.warn, `Source ${forceSource} forced for ${prop} value`);
			value = values[path.indexOf(forceSource)] as Network[K];
		}
	}

	network[prop] = value;
}

export async function resolveCoinGeckoCoin(network: Network, coins: CoinGeckoCoin[]) {
	const symbolMatchingCoins = coins.filter(coin => coin.symbol.toLowerCase() === network.symbol?.toLowerCase());
	const nameMatchingCoins = symbolMatchingCoins.filter(it => it.id === (coinGeckoId[network.name] || network.name));

	if (symbolMatchingCoins.length === 0) {
		log(log.warn, "No CoinGecko coin found by symbol");
		return;
	}

	if (symbolMatchingCoins.length > 1) {
		log(log.warn, "Multiple CoinGecko coins found by symbol");
	}

	if (nameMatchingCoins.length !== 1) {
		log(log.warn, "No CoinGecko coin found by symbol match the network name");
	}

	if (symbolMatchingCoins.length > 1 || nameMatchingCoins.length !== 1) {
		for (const coin of symbolMatchingCoins) {
			log(` - ${coin.id} (${coin.name})`);
		}
	}

	if (nameMatchingCoins.length !== 1) {
		return;
	}

	network.coinGeckoCoin = nameMatchingCoins[0]!;
}

export async function resolveSquids(network: Network) {
	for (const squidType of squidTypes) {
		let squidUrl: string|undefined = squidUrlTemplates[squidType]?.(network.name);

		if (squidType === "archive") {
			const archiveNetwork = archiveRegistryArchiveNetworkNames[network.name] || network.name;
			const archive = archivesJson.archives.find(it => archiveNetwork === it.network);
			squidUrl = archive?.providers.find(it => it.explorerUrl)?.explorerUrl;
		}

		const forcedSquidUrl = forceSquidUrl[network.name]?.[squidType];
		if (forcedSquidUrl) {
			log(log.warn, `URL for ${squidType} squid is forced to a non-standard URL`);
			squidUrl = forcedSquidUrl;
		}

		if (squidUrl && await checkUrl(squidUrl)) {
			network.squids[squidType] = squidUrl;
		}
	}
}

export function checkNetwork(network: Network) {
	log.flush();

	const checkPropsGroups: (keyof Omit<Network, "type"|"squids">)[][] = [
		["name", "displayName", "parachainId", "relayChain"],
		["prefix", "decimals", "symbol"],
		["icon", "color", "website"],
		["coinGeckoCoin"]
	];

	const requiredProps = ["name", "displayName", "icon", "prefix", "decimals", "symbol"];
	const requiredSquidTypes = ["archive"];

	for (const checkProps of checkPropsGroups) {
		for(const prop of checkProps) {
			let value = network[prop];
			let color = colors.green;

			if (value === undefined) {
				value = "not resolved";

				if (requiredProps.includes(prop)) {
					color = colors.red;

					network.hasErrors ??= [];
					network.hasErrors.push(prop);
				} else {
					color = color.yellow;

					network.hasWarnings ??= [];
					network.hasWarnings.push(prop);
				}
			} else if (prop === "coinGeckoCoin") {
				value = `${(value as CoinGeckoCoin).id} (${(value as CoinGeckoCoin).name})`;
			}

			log(`${prop}:`.padEnd(14), color(value.toString()));
		}

		log();
	}

	log("squids:");

	for(const squidType of squidTypes) {
		let squidUrl = network.squids[squidType];
		let color = colors.green;

		if (!squidUrl) {
			if (requiredSquidTypes.includes(squidType)) {
				color = color.red;

				network.hasErrors ??= [];
				network.hasErrors.push(`squids/${squidType}`);
			} else {
				color = color.yellow;

				network.hasWarnings ??= [];
				network.hasWarnings.push(`squids/${squidType}`);
			}

			squidUrl = "not resolved";
		}

		log(`- ${squidType}:`.padEnd(14), color(squidUrl));
	}

	log.flush();

	if (!network.hasErrors) {
		log(log.ok, "Network is valid");
	} else {
		log(log.error, "Network has errors, omitting ...");
	}
}

async function checkUrl(url: string) {
	try {
		const response = await fetch(url);

		if (response.status !== 200) {
			return false;
		}

		return true;
	} catch (e) {
		return false;
	}
}

function allEqualOrUndefined(args: any[]) {
	return args
		.filter(it => it !== undefined)
		.every((it, _, arr) => it === arr[0]);
}
