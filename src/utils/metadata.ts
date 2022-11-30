import { TypeRegistry, Metadata, expandMetadata } from "@polkadot/types";
import { DecodedMetadata, DecodedPallet } from "../model/decodedMetadata";

export function decodeMetadata(hex: `0x${string}`) {
	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, hex);
	registry.setMetadata(metadata);

	const latestMetadata = metadata.asLatest;

	const decodedMetadata: DecodedMetadata = {
		pallets: []
	};

	decodedMetadata.pallets = latestMetadata.pallets.map(pallet => {
		const decodedPallet: DecodedPallet = {
			name: pallet.name.toString(),
			calls: [],
			events: []
		};

		if (pallet.calls.isSome) {
			const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;
			decodedPallet.calls = calls.map(call => ({
				name: call.name.toString()
			}));
		}

		if (pallet.events.isSome) {
			const events = latestMetadata.lookup.getSiType(pallet.events.unwrap().type).def.asVariant.variants;
			decodedPallet.events = events.map(event => ({
				name: event.name.toString()
			}));
		}

		return decodedPallet;
	});

	return decodedMetadata;
}
