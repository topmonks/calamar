import { useCallback, useState } from "react";

import { Card, CardHeader } from "../components/Card";
import { useNetworkLoaderData } from "../hooks/useRootLoaderData";
import { getExtrinsic } from "../services/extrinsicsService";
import { getNetworks } from "../services/networksService";
import { NetworkSearchResult, SearchResult, search } from "../services/searchService";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Network } from "../model/network";

export const TestUniversalPage = () => {
	const [query, setQuery] = useState<string>("");
	const [result, setResult] = useState<SearchResult>();

	const handleSearch = useCallback(async () => {
		setResult(undefined);

		const results = await search(query);
		console.log(results);

		//const result = await searchItem("kusama", query);
		//console.log(result);

		setResult(results);
	}, [query]);

	return (
		<>
			<Card>
				<CardHeader>
					Universal search test
				</CardHeader>
				<div>
					<input type="text" value={query} onChange={(ev) => setQuery(ev.target.value)} />
					<button onClick={handleSearch}>search</button>
				</div>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>network</TableCell>
							<TableCell>blocks</TableCell>
							<TableCell>extrinsics</TableCell>
							<TableCell>accounts</TableCell>
							<TableCell>extrinsics by name</TableCell>
							<TableCell>events by name</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{result?.results.map(([network, result]) => (
							<TableRow key={network.name}>
								<TableCell>{network.name}</TableCell>
								<TableCell>{result.blocks.length}</TableCell>
								<TableCell>{result.extrinsics.length}</TableCell>
								<TableCell>{result.accounts.length}</TableCell>
								<TableCell>{result.extrinsicsByNameTotal}</TableCell>
								<TableCell>{result.eventsByNameTotal}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</>
	);
};
