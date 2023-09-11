import { useCallback, useState } from "react";

import { Card, CardHeader } from "../components/Card";
import { useRootLoaderData } from "../hooks/useRootLoaderData";
import { getExtrinsic } from "../services/extrinsicsService";
import { getNetworks } from "../services/networksService";
import { searchItem } from "../services/searchService";

export const TestUniversalPage = () => {
	const [query, setQuery] = useState<string>("");

	const search = useCallback(async () => {
		const networks = getNetworks();
		/*for (const network of networks.slice(0,10)) {
			const extrinsic = await getExtrinsic(network.name, {hash_eq: query});
			console.log("result", network.name, extrinsic);
		}

		const results = await Promise.allSettled(networks.map(async it => [it.name, await getExtrinsic(it.name, {hash_eq: query})]));

		console.log(results.filter(result => !!(result as any).value[1]).map(result => (result as any).value));*/

		const result = await searchItem("kusama", query);
		console.log(result);
	}, [query]);

	return (
		<>
			<Card>
				<CardHeader>
					Universal search test
				</CardHeader>
				<div>
					<input type="text" value={query} onChange={(ev) => setQuery(ev.target.value)} />
					<button onClick={search}>search</button>
				</div>
			</Card>
		</>
	);
};
