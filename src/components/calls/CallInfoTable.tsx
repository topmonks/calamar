import { Chip } from "@mui/material";

import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { Call } from "../../model/call";
import { Resource } from "../../model/resource";

import { encodeAddress } from "../../utils/formatAddress";
import { getCallMetadataByName } from "../../utils/queryMetadata";

import { AccountAddress } from "../AccountAddress";
import { ButtonLink } from "../ButtonLink";
import DataViewer from "../DataViewer";
import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";

export type CallInfoTableProps = {
	network: string;
	call: Resource<Call>;
}

const CallInfoTableAttribute = InfoTableAttribute<Call>;

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, call} = props;

	return (
		<InfoTable
			data={call.data}
			loading={call.loading}
			notFound={call.notFound}
			notFoundMessage="No call found"
			error={call.error}
		>
			<CallInfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.block.timestamp} utc />
				}
			/>
			<CallInfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<CallInfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network}/block/${data.block.id}`}>
						{data.block.height}
					</Link>
				}
				copyToClipboard={(data) => data.block.id}
			/>
			<CallInfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link to={`/${network}/extrinsic/${data.extrinsic.id}`}>
						{data.extrinsic.id}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsic.id}
			/>
			<CallInfoTableAttribute
				label="Parent call"
				render={(data) => data.parent &&
					<Link to={`/${network}/call/${data.parent.id}`}>
						{data.parent.id}
					</Link>
				}
				copyToClipboard={(data) => data.parent?.id}
				hide={(data) => !data.parent}
			/>
			<CallInfoTableAttribute
				label="Sender"
				render={(data) =>
					data.origin && data.origin.value.__kind !== "None" && (
						<AccountAddress
							network={network}
							address={data.origin.value.value}
							prefix={data.runtimeSpec.metadata.ss58Prefix}
						/>
					)
				}
				copyToClipboard={(data) =>
					data.origin && data.origin.value.__kind !== "None" &&
					encodeAddress(
						data.origin.value.value,
						data.runtimeSpec.metadata.ss58Prefix
					)
				}
				hide={(data) => !data.origin || data.origin.value.__kind === "None"}
			/>
			<CallInfoTableAttribute
				label="Result"
				render={(data) =>
					<Chip
						variant="outlined"
						icon={<img src={data.success ? CheckIcon : CrossIcon}  />}
						label={data.success ? "Success" : "Fail"}
					/>
				}
			/>
			<CallInfoTableAttribute
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
			<CallInfoTableAttribute
				label="Parameters"
				render={(data) =>
					<DataViewer
						network={network}
						data={data.args}
						metadata={
							getCallMetadataByName(
								data.runtimeSpec.metadata,
								data.name
							)?.args
						}
						runtimeSpec={data.runtimeSpec}
						copyToClipboard
					/>
				}
			/>
			<CallInfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
