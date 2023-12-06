import Dexie, { Table } from "dexie";

import { RuntimeMetadataSpec } from "../model/runtime-metadata/runtimeMetadataSpec";
import { RuntimeMetadataPallet } from "../model/runtime-metadata/runtimeMetadataPallet";
import { RuntimeMetadataCall } from "../model/runtime-metadata/runtimeMetadataCall";
import { RuntimeMetadataEvent } from "../model/runtime-metadata/runtimeMetadataEvent";
import { RuntimeMetadataConstant } from "../model/runtime-metadata/runtimeMetadataConstant";
import { RuntimeMetadataStorage } from "../model/runtime-metadata/runtimeMetadataStorage";
import { RuntimeMetadataError } from "../model/runtime-metadata/runtimeMetadataError";

export class RuntimeMetadataRepository extends Dexie {
	specs!: Table<RuntimeMetadataSpec, [string, string]>;
	pallets!: Table<RuntimeMetadataPallet, [string, string, string]>;
	calls!: Table<RuntimeMetadataCall, [string, string, string, string]>;
	events!: Table<RuntimeMetadataEvent, [string, string, string, string]>;
	constants!: Table<RuntimeMetadataConstant, [string, string, string, string]>;
	storages!: Table<RuntimeMetadataStorage, [string, string, string, string]>;
	errors!: Table<RuntimeMetadataError, [string, string, string, string]>;

	constructor() {
		super("runtime-metadata");

		this.version(1).stores({
			specs: "[network+specVersion]",
			pallets: "[network+specVersion+name],[network+specVersion],name",
			calls: "[network+specVersion+pallet+name],[network+specVersion+pallet],name",
			events: "[network+specVersion+pallet+name],[network+specVersion+pallet],name",
			constants: "[network+specVersion+pallet+name],[network+specVersion+pallet]",
			storages: "[network+specVersion+pallet+name],[network+specVersion+pallet]",
			errors: "[network+specVersion+pallet+name],[network+specVersion+pallet]",
		});
	}
}

export const runtimeMetadataRepository = new RuntimeMetadataRepository();
