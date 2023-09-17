import { TypeRegistry, Metadata, PortableRegistry } from "@polkadot/types";
import { DecodedCall, DecodedEvent, DecodedMetadata, DecodedPallet } from "../../model/decodedMetadata";
import { Si1Variant } from "@polkadot/types/interfaces";
import { getSiName } from "@polkadot/types/metadata/util";
import { RuntimeSpec } from "../../model/runtimeSpec";
import { fetchArchive } from "../../services/fetchService";
import { uniq } from "../uniq";

function decodeCall(lookup: PortableRegistry, call: Si1Variant) {
	const { fields } = call;

	const decodedCall: DecodedCall = {
		name: call.name.toString(),
		args: []
	};

	decodedCall.args = fields.map((field, index) => ({
		name: field.name.unwrapOr(index).toString(),
		type: getSiName(lookup, field.type),
		typeName: field.typeName.isSome
			? field.typeName.unwrap().toString()
			: undefined
	}));

	return decodedCall;
}

function decodeEvent(lookup: PortableRegistry, event: Si1Variant) {
	const { fields } = event;

	const decodedEvent: DecodedEvent = {
		name: event.name.toString(),
		args: []
	};

	decodedEvent.args = fields.map((field, index) => ({
		name: field.name.unwrapOr(index).toString(),
		type: getSiName(lookup, field.type),
		typeName: field.typeName.isSome
			? field.typeName.unwrap().toString()
			: undefined
	}));

	return decodedEvent;
}

export async function decodeMetadata(hex: `0x${string}`) {
	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, hex);
	//console.log(metadata.toHex() === hex);

	registry.setMetadata(metadata);

	const latestMetadata = metadata.asLatest;
	const ss58Prefix = latestMetadata.registry.getChainProperties()?.ss58Format.unwrap()?.toNumber();

	const decodedMetadata: DecodedMetadata = {
		ss58Prefix: typeof ss58Prefix === "number" ? ss58Prefix : 42,
		pallets: []
	};

	decodedMetadata.pallets = latestMetadata.pallets.map(pallet => {
		const decodedPallet: DecodedPallet = {
			name: pallet.name.toString(),
			calls: [],
			events: [],
		};

		if (pallet.calls.isSome) {
			const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;
			decodedPallet.calls = calls.map(call => decodeCall(latestMetadata.lookup, call));
		}

		if (pallet.events.isSome) {
			const events = latestMetadata.lookup.getSiType(pallet.events.unwrap().type).def.asVariant.variants;
			decodedPallet.events = events.map(event => decodeEvent(latestMetadata.lookup, event));
		}

		return decodedPallet;
	});

	return decodedMetadata;
}

export async function getLatestRuntimeSpec(network: string) {
	const response = await fetchArchive<{spec: Omit<RuntimeSpec, "metadata">[]}>(
		network, `
			query {
				spec: metadata(orderBy: specVersion_DESC, limit: 1) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`
	);

	const spec = response.spec[0]!;

	return {
		...spec,
		metadata: await decodeMetadata(spec.hex)
	};
}


export async function getRuntimeSpecs(
	network: string,
	specVersions: (number|"latest")[]| undefined
) {
	if (specVersions == undefined || specVersions.length === 0) {
		specVersions = [];
	}

	const specs: Record<number|string, RuntimeSpec> = {};

	if (specVersions.includes("latest")) {
		specs["latest"] = await getLatestRuntimeSpec(network);
		specVersions = specVersions.filter(it => it !== "latest");
	}

	console.log("before fetch");
	const response = await fetchArchive<{specs: Omit<RuntimeSpec, "metadata">[]}>(
		network, `
			query ($specVersions: [Int!]!) {
				specs: metadata(where: {specVersion_in: $specVersions}, orderBy: specVersion_DESC) {
					id
					blockHash
					blockHeight
					specName
					specVersion
					hex
				}
			}
		`,
		{
			specVersions: uniq(specVersions)
		}
	);

	for (const spec of response.specs) {
		specs[spec.specVersion] = {
			...spec,
			metadata: await decodeMetadata(spec.hex)
		};
	}

	return specs;
}

self.onmessage = async (e: MessageEvent<string>) => {
	/*console.log("tu", e.data);
	try {
		const specs = await getRuntimeSpecs("acala", ["latest"]);
		const latestSpec = specs["latest"];
		console.log("meta length", JSON.stringify(latestSpec?.metadata).length);
	} catch (e) {
		console.log(e);
	}
	console.log("tu 2");*/

	const hex = e.data as `0x${string}`;

	//console.log("hex lenght", hex.length);

	const registry = new TypeRegistry();
	const metadata = new Metadata(registry, hex);

	console.log("json length", JSON.stringify(metadata.toJSON()).length);

	registry.setMetadata(metadata);

	//return {ss58Prefix: 0, pallets: []};
	const latestMetadata = metadata.asLatest;
	const ss58Prefix = latestMetadata.registry.getChainProperties()?.ss58Format.unwrap()?.toNumber();

	const decodedMetadata: DecodedMetadata = {
		ss58Prefix: typeof ss58Prefix === "number" ? ss58Prefix : 42,
		pallets: []
	};

	decodedMetadata.pallets = latestMetadata.pallets.map(pallet => {
		const decodedPallet: DecodedPallet = {
			name: pallet.name.toString(),
			calls: [],
			events: [],
		};

		if (pallet.calls.isSome) {
			const calls = latestMetadata.lookup.getSiType(pallet.calls.unwrap().type).def.asVariant.variants;
			decodedPallet.calls = calls.map(call => decodeCall(latestMetadata.lookup, call));
		}

		if (pallet.events.isSome) {
			const events = latestMetadata.lookup.getSiType(pallet.events.unwrap().type).def.asVariant.variants;
			decodedPallet.events = events.map(event => decodeEvent(latestMetadata.lookup, event));
		}

		return decodedPallet;
	});

	console.log("decoded length", JSON.stringify(decodedMetadata).length);

	//self.postMessage(JSON.stringify(metadata.toJSON()));
	self.postMessage(JSON.stringify(decodedMetadata));
	//self.postMessage(JSON.stringify({}));
};

export {};
