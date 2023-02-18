const fs = require("fs");
const {networks} = require("@subsquid/archive-registry/networks.json");
const squids = require("./src/squids.json");

const urlTemplates = {
	balances: (network) => `https://squid.subsquid.io/${network}-balances/graphql`,
	explorer: (network) => `https://squid.subsquid.io/gs-explorer-${network}/graphql`,
	main: (network) => `https://squid.subsquid.io/gs-main-${network}/graphql`,
	stats: (network) => `https://squid.subsquid.io/gs-stats-${network}/graphql`
};

async function checkUrl(url) {
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

async function main() {
	for (const squidType of Object.keys(squids)) {
		for (const network of networks) {
			const squidUrl = urlTemplates[squidType](network.name);

			let squid = squids[squidType].find(it => it.network === network.name);

			if (await checkUrl(squidUrl)) {
				if (!squid) {
					console.log(`[${squidType} / ${network.name}] new squid found: ${squidUrl}`);

					squid = {
						network: network.name,
						explorerUrl: ""
					};

					squids[squidType].push(squid);
				}

				squid.explorerUrl = squidUrl;
			} else {
				if (squid) {
					console.warn(`[${squidType} / ${network.name}] uses non-standard url: ${squid.explorerUrl}`);
					if (! (await checkUrl(squid.explorerUrl))) {
						console.warn(`[${squidType} / ${network.name}] used url ${squid.explorerUrl} doesn't work`);
					}
				}
			}
		}

		squids[squidType].sort((a, b) => a.network.localeCompare(b.network));
	}

	//console.log(squids);
	fs.writeFileSync("./src/squids.json", JSON.stringify(squids, null, 4));
}

main();
