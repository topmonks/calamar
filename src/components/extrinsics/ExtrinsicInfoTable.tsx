import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { encodeAddress } from "../../utils/formatAddress";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";
import { Chip } from "@mui/material";

export type ExtrinsicInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const ExtrinsicInfoTable = (props: ExtrinsicInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No extrinsic found"
			error={error}
		>
			<InfoTableAttribute
				label="Hash"
				render={(data) => data.hash}
				copyToClipboard={(data) => data.hash}
			/>
			<InfoTableAttribute
				label="Timestamp"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network}/block/${data.block.id}`}>
						{data.block.id}
					</Link>
				}
				copyToClipboard={(data) => data.block.id}
			/>
			<InfoTableAttribute
				label="Account"
				render={(data) => data.signature?.address &&
					<Link
						to={`/${network}/account/${data.signature.address}`}
					>
						{encodeAddress(network, data.signature?.address) || data.signature?.address}
					</Link>
				}
				copyToClipboard={(data) =>
					encodeAddress(
						network,
						data.signature?.address
					) || data.signature?.address
				}
			/>
			<InfoTableAttribute
				label="Name"
				render={(data) => data.call.name}
			/>
			<InfoTableAttribute
				label="Parameters"
				render={(data) =>
					<ParamsTable args={data.call.args} />
				}
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
				label="Error"
				render={(data) => <ParamsTable args={data.error} />}
				hide={(data) => !data.error}
			/>
			<InfoTableAttribute
				label="Fee"
				render={(data) => data.fee}
			/>
			<InfoTableAttribute
				label="Signature"
				render={(data) => data.signature?.signature.value}
				copyToClipboard={(data) => data.signature?.signature.value}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
