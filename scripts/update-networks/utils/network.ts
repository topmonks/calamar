import fs from "fs";
import path from "path";
import colors from "colors";
import archivesJson from "@subsquid/archive-registry/archives.json";

import { archiveRegistryArchiveNetworkNames, forceSquidUrl, squidTypes, squidUrlTemplates } from "../config";
import { Network, SourceData, SourceType } from "../model";
import { log } from "./log";

export function resolveIcon(network: Network) {
	const iconsPath = "assets/network-icons";
	const iconsDir = path.join(__dirname, "..", "..", "..", "public", iconsPath);

	const iconFilename = fs.readdirSync(iconsDir).find(it => it.startsWith(`${network.name}.`));

	if (iconFilename) {
		network.icon = `/${iconsPath}/${iconFilename}`;
	}
}

export function resolveProperty<K extends keyof Pick<Network, "prefix"|"decimals"|"symbol">>(network: Network, prop: K, sources: SourceData[], path: SourceType[], forceSource?: SourceType) {
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

	let value = values.filter(it => it !== undefined)[0];

	if (forceSource) {
		log(log.warn, `Source ${forceSource} forced for ${prop} value`);
		value = values[path.indexOf(forceSource)];
	}

	network[prop] = value as Network[K];
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
		["name", "displayName", "icon"],
		["prefix", "decimals", "symbol"]
	];

	for (const checkProps of checkPropsGroups) {
		for(const prop of checkProps) {
			let value = network[prop];
			let color = colors.green;

			if (value === undefined) {
				color = colors.red;
				value = "not resolved";

				network.hasErrors ??= [];
				network.hasErrors.push(prop);
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
			if (squidType === "archive") {
				color = color.red;

				network.hasErrors ??= [];
				network.hasErrors.push("squids/archive");
			} else {
				color = color.yellow;
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
