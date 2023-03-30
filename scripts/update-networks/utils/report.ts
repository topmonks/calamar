import CliTable3 from "cli-table3";
import colors from "colors";

import { squidTypes } from "../config/squids";
import { Network } from "../model";

import { log } from "./log";

export function printPropsReport(networks: Network[]) {
	const validNetworks = networks.filter(it => !it.hasErrors);
	const invalidNetworks = networks.filter(it => it.hasErrors);

	const props = ["icon", "color", "website", "parachainId", "relayChain", "prefix", "decimals", "symbol", "coinGeckoCoin"];
	const columns = props.map(it => it.replace(/(([a-zA-Z])[a-z]+)/g, "$2").toUpperCase());

	const table = new CliTable3();

	table.push([{
		content: "Props",
		colSpan: columns.length + 3,
		hAlign: "center"
	}]);

	table.push([{
		content: [
			...columns.map((column, index) => `${column} - ${props[index]}`),
			"S - squids"
		].join("\n"),
		colSpan: columns.length + 3
	}]);

	table.push([" ", " ", ...columns, "S"].map(it => colors.red(it)));

	for (const network of [...validNetworks, ...invalidNetworks]) {
		const row = [
			network.hasErrors ? log.error
				: network.hasWarnings ? log.warn
					: log.ok,
			network.name,
		];

		for (const prop of props) {
			row.push(
				network.hasErrors?.includes(prop) ? log.error
					: network.hasWarnings?.includes(prop) ? log.warn
						: log.ok
			);
		}

		row.push(
			network.hasErrors?.some(it => it.startsWith("squids/")) ? log.error
				: network.hasWarnings?.some(it => it.startsWith("squids/")) ? log.warn
					: log.ok
		);

		table.push(row);
	}

	log(table.toString());
}

export function printSquidReport(networks: Network[]) {
	const columns = squidTypes.map(it => it.replace(/(([a-zA-Z])[a-z]+)/g, "$2").toUpperCase());

	const table = new CliTable3();

	table.push([{
		content: "Squids",
		colSpan: columns.length + 1,
		hAlign: "center"
	}]);

	table.push([{
		content: columns.map((column, index) => `${column} - ${squidTypes[index]}`).join("\n"),
		colSpan: columns.length + 1
	}]);

	table.push([" ", ...columns.map(it => colors.red(it))]);

	for (const network of networks) {
		const row = [
			network.name,
		];

		for (const squid of squidTypes) {
			row.push(
				network.hasErrors?.includes(`squids/${squid}`) ? log.error
					: network.hasWarnings?.includes(`squids/${squid}`) ? log.warn
						: log.ok
			);
		}

		table.push(row);
	}

	log(table.toString());
}

export function printCountsReport(networks: Network[]) {
	const validNetworks = networks.filter(it => !it.hasErrors);
	const validNetworksWithWarnings = validNetworks.filter(it => it.hasWarnings);
	const invalidNetworks = networks.filter(it => it.hasErrors);

	const table = new CliTable3();

	table.push(["valid networks", colors.green(`${validNetworks.length}`) + (validNetworksWithWarnings.length > 0 ? colors.yellow(` (${validNetworksWithWarnings.length} with warnings)`) : "")]);
	table.push(["invalid networks", colors.red(`${invalidNetworks.length}`)]);

	log(table.toString());
}
