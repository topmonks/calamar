import { isHex } from "@polkadot/util";
import { isAddress } from "@polkadot/util-crypto";

import { ArchiveBlock } from "../model/archive/archiveBlock";
import { ArchiveExtrinsic } from "../model/archive/archiveExtrinsic";
import { decodeAddress } from "../utils/formatAddress";

import { fetchArchive, fetchExplorerSquid } from "./fetchService";
import { normalizeExtrinsicName } from "./extrinsicsService";
import { normalizeEventName } from "./eventsService";

export async function searchItem(network: string, query: string) {
	let extrinsicFilter: any = {extrinsicHash_eq: "0x"}; // default failing filter
	let blockFilter: any = {hash_eq: "0x"}; // default failing filter
	let extrinsicsByNameCounterId: any = ""; // default failing filter
	let eventsByNameCounterId: any = ""; // default failing filter

	const maybeHash = isHex(query);
	const maybeHeight = query?.match(/^\d+$/);
	const maybeAddress = isAddress(query);
	const maybeName = query && !maybeHash && !maybeHeight;

	if (maybeHash) {
		extrinsicFilter = {extrinsicHash_eq: query};
		blockFilter = {hash_eq: query};
	}

	if (maybeHeight) {
		blockFilter = {height_eq: parseInt(query)};
	}


	if (maybeName) {
		const {palletName, callName} = await normalizeExtrinsicName(network, query);

		extrinsicsByNameCounterId = callName
			? `Extrinsics.${palletName}.${callName}`
			: `Extrinsics.${palletName}`;
	}

	if (maybeName) {
		const {palletName, eventName} = await normalizeEventName(network, query);

		eventsByNameCounterId = eventName
			? `Events.${palletName}.${eventName}`
			: `Events.${palletName}`;
	}

	const response = await fetchExplorerSquid<{
		extrinsics: ArchiveExtrinsic[],
		blocks: ArchiveBlock[],
		extrinsicsByNameCounter: {total: number} | null,
		eventsByNameCounter: {total: number} | null
	}>(
		network,
		`query (
			$extrinsicFilter: ExtrinsicWhereInput,
			$blockFilter: BlockWhereInput,
			$extrinsicsByNameCounterId: String!,
			$eventsByNameCounterId: String!
		) {
			extrinsics(limit: 1, offset: 0, where: $extrinsicFilter, orderBy: id_DESC) {
				id
			}
			blocks(limit: 1, offset: 0, where: $blockFilter, orderBy: id_DESC) {
				id
			},
			extrinsicsByNameCounter: itemsCounterById(id: $extrinsicsByNameCounterId) {
				total
			}
			eventsByNameCounter: itemsCounterById(id: $eventsByNameCounterId) {
				total
			}
		}`,
		{
			extrinsicFilter,
			blockFilter,
			extrinsicsByNameCounterId,
			eventsByNameCounterId,
		}
	);

	const result: any = {
		extrinsics: response.extrinsics,
		blocks: response.blocks,
		accounts: [],
		extrinsicsByNameTotal: response.extrinsicsByNameCounter?.total || 0,
		eventsByNameTotal: response.eventsByNameCounter?.total || 0
	};

	if (maybeAddress && result.extrinsic.length === 0 && result.block.length === 0) {
		result.accounts = [{
			id: decodeAddress(query)
		}];
	}

	return result;
}
