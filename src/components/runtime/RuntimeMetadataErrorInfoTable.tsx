/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import { Resource } from "../../model/resource";
import { RuntimeMetadataError } from "../../model/runtime-metadata/runtimeMetadataError";

import { InfoTable, InfoTableAttribute } from "../InfoTable";

import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

const errorNameStyle = css`
	padding: 2px 10px;
	margin: -4px 0;

	border-radius: 4px;
	background-color: #f5f5f5;

	line-height: 28px;
`;

export type ErrorInfoTableProps = {
	error: Resource<RuntimeMetadataError>;
}

const RuntimeMetadataErrorInfoTableAttribute = InfoTableAttribute<RuntimeMetadataError>;

export const RuntimeMetadataErrorInfoTable = (props: ErrorInfoTableProps) => {
	const {error} = props;

	return (
		<InfoTable
			data={error.data}
			loading={error.loading}
			notFound={error.notFound}
			notFoundMessage="No call found"
			error={error.error}
		>
			<RuntimeMetadataErrorInfoTableAttribute
				label="Error"
				render={(data) =>
					<span css={errorNameStyle}>
						{data.pallet}.{data.name}
					</span>
				}
			/>
			<RuntimeMetadataErrorInfoTableAttribute
				label="Description"
				render={(data) =>
					<RuntimeMetadataDescription>
						{data.description}
					</RuntimeMetadataDescription>
				}
			/>
		</InfoTable>
	);
};
