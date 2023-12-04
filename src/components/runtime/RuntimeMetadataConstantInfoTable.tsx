/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { RuntimeMetadataConstant } from "../../model/runtime-metadata/runtimeMetadataConstant";

import { DataViewer } from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const constantNameStyle = css`
	padding: 2px 10px;
	margin: -4px 0;

	border-radius: 4px;
	background-color: #f5f5f5;

	line-height: 28px;
`;

export type ConstantInfoTableProps = {
	network: Network;
	constant: Resource<RuntimeMetadataConstant>;
}

const RuntimeMetadataConstantInfoTableAttribute = InfoTableAttribute<RuntimeMetadataConstant>;

export const RuntimeMetadataConstantInfoTable = (props: ConstantInfoTableProps) => {
	const {network, constant} = props;

	return (
		<InfoTable
			data={constant.data}
			loading={constant.loading}
			notFound={constant.notFound}
			notFoundMessage="No call found"
			error={constant.error}
		>
			<RuntimeMetadataConstantInfoTableAttribute
				label="Constant"
				render={(data) =>
					<span css={constantNameStyle}>
						{data.pallet}.{data.name}
					</span>
				}
			/>
			<RuntimeMetadataConstantInfoTableAttribute
				label="Description"
				render={(data) => <RuntimeMetadataDescription>{data.description}</RuntimeMetadataDescription>}
			/>
			<RuntimeMetadataConstantInfoTableAttribute
				label="Type"
				render={(data) => <DataViewer network={network} data={data.type} simple />}
			/>
			<RuntimeMetadataConstantInfoTableAttribute
				label="Value"
				render={(data) => {
					return <DataViewer network={network} data={data.value} simple={typeof data.value !== "object"} />;
				}}
			/>
		</InfoTable>
	);
};
