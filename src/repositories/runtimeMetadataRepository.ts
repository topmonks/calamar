import Dexie, { Table } from "dexie";

import { RuntimeMetadataSpec } from "../model/runtime-metadata/runtimeMetadataSpec";
import { RuntimeMetadataPallet } from "../model/runtime-metadata/runtimeMetadataPallet";
import { RuntimeMetadataCall } from "../model/runtime-metadata/runtimeMetadataCall";
import { RuntimeMetadataEvent } from "../model/runtime-metadata/runtimeMetadataEvent";

export class RuntimeMetadataRepository extends Dexie {
	specs!: Table<RuntimeMetadataSpec, [string, number]>;
	pallets!: Table<RuntimeMetadataPallet, [string, number, string]>;
	calls!: Table<RuntimeMetadataCall, [string, number, string, string]>;
	events!: Table<RuntimeMetadataEvent, [string, number, string, string]>;

	constructor() {
		super("runtime-metadata-dexie");

		this.version(1).stores({
			specs: "[network+specVersion]",
			pallets: "[network+specVersion+name],[network+specVersion]",
			calls: "[network+specVersion+pallet+name],[network+specVersion+pallet]",
			events: "[network+specVersion+pallet+name],[network+specVersion+pallet]"
		});
	}
}

export const runtimeMetadataRepository = new RuntimeMetadataRepository();
