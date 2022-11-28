import { TypeRegistry, Metadata, expandMetadata } from "@polkadot/types";

export function decodeMetadata(hex: `0x${string}`) {
	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, hex);
	registry.setMetadata(metadata);

	return metadata.asLatest;
	/*const expandedMetadata = expandMetadata(registry, metadata);
	return expandedMetadata;*/
}
