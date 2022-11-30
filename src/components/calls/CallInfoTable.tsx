import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { Resource } from "../../model/resource";
import { RuntimeSpec } from "../../model/runtimeSpec";
import { encodeAddress } from "../../utils/formatAddress";
import { getCallMetadataByName } from "../../utils/queryMetadata";

import { AccountAddress } from "../AccountAddress";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import DataViewer from "../DataViewer";
import { ButtonLink } from "../ButtonLink";

export type CallInfoTableProps = {
	network: string;
	call: Resource<any>;
	runtimeSpecs: Resource<RuntimeSpec[]>;
}

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, call, runtimeSpecs} = props;

	return (
		<InfoTable
			data={call.data}
			additionalData={[runtimeSpecs.data?.[0]?.metadata]}
			loading={call.loading || runtimeSpecs.loading}
			notFound={call.notFound}
			notFoundMessage="No call found"
			error={call.error}
		>
			<InfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.block.timestamp} utc />
				}
			/>
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network}/block/${data.block.id}`}>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.id}
			/>
			<InfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link to={`/${network}/extrinsic/${data.extrinsic.id}`}>
						{data.extrinsic.id}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsic.id}
			/>
			<InfoTableAttribute
				label="Parent call"
				render={(data) => data.parent &&
					<Link to={`/${network}/call/${data.parent.id}`}>
						{data.parent.id}
					</Link>
				}
				copyToClipboard={(data) => data.parent?.id}
				hide={(data) => !data.parent}
			/>
			<InfoTableAttribute
				label="Sender"
				render={(data) =>
					data.origin && data.origin.value.__kind !== "None" && (
						<AccountAddress network={network} address={data.origin.value.value} />
					)
				}
				copyToClipboard={(data) =>
					data.origin && data.origin.value.__kind !== "None" &&
					encodeAddress(
						network,
						data.origin.value.value
					)
				}
				hide={(data) => !data.origin || data.origin.value.__kind === "None"}
			/>
			<InfoTableAttribute
				label="Result"
				render={(data) =>
					<Chip
						variant="outlined"
						icon={<img src={data.success ? CheckIcon : CrossIcon}  />}
						label={data.success ? "Success" : "Fail"}
					/>
				}
			/>
			<InfoTableAttribute
				label="Name"
				render={(data) =>
					<ButtonLink
						to={`/${network}/search?query=${data.name}`}
						size="small"
						color="secondary"
					>
						{data.name}
					</ButtonLink>
				}
			/>
			<InfoTableAttribute
				label="Parameters"
				render={(data, metadata) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={metadata && getCallMetadataByName(metadata, data.name)?.args}
						copyToClipboard
					/>
				}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
