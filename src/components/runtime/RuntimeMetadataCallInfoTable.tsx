import { Network } from "../../model/network";
import { Resource } from "../../model/resource";
import { RuntimeMetadataCall } from "../../model/runtime-metadata/runtimeMetadataCall";

import { ButtonLink } from "../ButtonLink";
import { InfoTable, InfoTableAttribute } from "../InfoTable";

import { RuntimeMetadataArgsViewer } from "./RuntimeMetadataArgs";
import { RuntimeMetadataDescription } from "./RuntimeMetadataDescription";

export type CallInfoTableProps = {
	network: Network;
	call: Resource<RuntimeMetadataCall>;
}

const RuntimeMetadataCallInfoTableAttribute = InfoTableAttribute<RuntimeMetadataCall>;

export const RuntimeMetadataCallInfoTable = (props: CallInfoTableProps) => {
	const {network, call} = props;

	return (
		<InfoTable
			data={call.data}
			loading={call.loading}
			notFound={call.notFound}
			notFoundMessage="No call found"
			error={call.error}
		>
			<RuntimeMetadataCallInfoTableAttribute
				label="Call"
				render={(data) =>
					<ButtonLink
						to={`/search/extrinsics?query=${data.pallet}.${data.name}&network=${network.name}`}
						size="small"
						color="secondary"
					>
						{data.pallet}.{data.name}
					</ButtonLink>
				}
			/>
			<RuntimeMetadataCallInfoTableAttribute
				label="Description"
				render={(data) => <RuntimeMetadataDescription>{data.description}</RuntimeMetadataDescription>}
			/>
			<RuntimeMetadataCallInfoTableAttribute
				label="Parameters"
				render={(data) => <RuntimeMetadataArgsViewer network={network} args={data.args} />}
			/>
		</InfoTable>
	);
};
