import CrossIcon from "../../assets/cross-icon.png";
import CheckIcon from "../../assets/check-icon.png";

import { shortenHash } from "../../utils/shortenHash";
import { shortenId } from "../../utils/shortenId";

import { InfoTable, InfoTableAttribute } from "../InfoTable";
import { Link } from "../Link";
import { Time } from "../Time";
import ParamsTable from "../ParamsTable";
import { encodeAddress } from "../../utils/formatAddress";

export type CallInfoTableProps = {
	network: string;
	data: any;
	loading?: boolean;
	notFound?: boolean;
	error?: any;
}

export const CallInfoTable = (props: CallInfoTableProps) => {
	const {network, data, loading, notFound, error} = props;

	return (
		<InfoTable
			data={data}
			loading={loading}
			notFound={notFound}
			notFoundMessage="No call found"
			error={error}
		>
			<InfoTableAttribute
				label="ID"
				render={(data) => data.id}
			/>
			<InfoTableAttribute
				label="Name"
				render={(data) => data.name}
			/>
			<InfoTableAttribute
				label="Block time"
				render={(data) =>
					<Time time={data.block.timestamp} fromNow />
				}
			/>
			<InfoTableAttribute
				label="Success"
				render={(data) =>
					<img src={data.success ? CheckIcon : CrossIcon} />
				}
			/>
			<InfoTableAttribute
				label="Sender"
				render={(data) =>
					data.origin && data.origin.value.__kind !== "None" && (
						<Link
							to={`/${network}/account/${data.origin.value.value}`}
						>
							{shortenHash(
								(network &&
									encodeAddress(network, data.origin.value.value)) ||
								data.origin.value.value
							)}
						</Link>
					)
				}
			/>
			<InfoTableAttribute
				name="parameters"
				label="Parameters"
				render={(data) => <ParamsTable args={data.args} />}
			/>
			<InfoTableAttribute
				label="Extrinsic"
				render={(data) =>
					<Link to={`/${network}/extrinsic/${data.extrinsic.id}`}>
						{shortenId(data.extrinsic.id)}
					</Link>
				}
				copyToClipboard={(data) => data.extrinsic.id}
			/>
			<InfoTableAttribute
				label="Block"
				render={(data) =>
					<Link to={`/${network}/block/${data.block.id}`}>
						{shortenId(data.block.id)}
					</Link>
				}
				copyToClipboard={(data) => data.block.id}
			/>
			<InfoTableAttribute
				label="Parent"
				render={(data) => data.parent &&
					<Link to={`/${network}/call/${data.parent.id}`}>
						{shortenId(data.parent.id)}
					</Link>
				}
				copyToClipboard={(data) => data.parent?.id}
			/>
			<InfoTableAttribute
				label="Spec version"
				render={(data) => data.block.spec.specVersion}
			/>
		</InfoTable>
	);
};
