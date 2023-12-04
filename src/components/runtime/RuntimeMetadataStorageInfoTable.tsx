/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { RuntimeMetadataStorage } from "../../model/runtime-metadata/runtimeMetadataStorage";

import { DataViewer } from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const storageNameStyle = css`
	padding: 2px 10px;
	margin: -4px 0;

	border-radius: 4px;
	background-color: #f5f5f5;

	line-height: 28px;
`;

export type StorageInfoTableProps = {
	network: Network;
	storage: Resource<RuntimeMetadataStorage>;
}

const RuntimeMetadataStorageInfoTableAttribute = InfoTableAttribute<RuntimeMetadataStorage>;

export const RuntimeMetadataStorageInfoTable = (props: StorageInfoTableProps) => {
	const {network, storage} = props;

	return (
		<InfoTable
			data={storage.data}
			loading={storage.loading}
			notFound={storage.notFound}
			notFoundMessage="No call found"
			error={storage.error}
		>
			<RuntimeMetadataStorageInfoTableAttribute
				label="Storage"
				render={(data) =>
					<span css={storageNameStyle}>
						{data.pallet}.{data.name}
					</span>
				}
			/>
			<RuntimeMetadataStorageInfoTableAttribute
				label="Description"
				render={(data) => <RuntimeMetadataDescription>{data.description}</RuntimeMetadataDescription>}
			/>
			<RuntimeMetadataStorageInfoTableAttribute
				label="Parameters"
				render={(data) =>
					data.args
						? <DataViewer network={network} data={data.args} simple />
						: <span>None</span>
				}
			/>
			<RuntimeMetadataStorageInfoTableAttribute
				label="Return Type"
				render={(data) => <DataViewer network={network} data={data.returnType} simple />}
			/>
		</InfoTable>
	);
};
