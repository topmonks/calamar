import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow } from "@mui/material";

import Card from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import InfoTable from "../components/InfoTable";
import { useExtrinsic } from "../hooks/useExtrinsic";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { encodeAddress } from "../utils/formatAddress";

type AccountPageParams = {
	network: string;
	address: string;
};

function AccountPage() {
	const { network, address } = useParams() as AccountPageParams;

	const filter = {
		OR: [
			{ signature_jsonContains: `{"address": "${address}" }` },
			{ signature_jsonContains: `{"address": { "value": "${address}"} }` },
		],
	};

	const [accountCheck, { loading }] = useExtrinsic(network, filter);
	const extrinsics = useExtrinsics(network, filter);

	const encodedAddress = useMemo(
		() => encodeAddress(network, address),
		[network, address]
	);

	const encoded42Address = useMemo(
		() => encodeAddress(network, address, 42),
		[network, address]
	);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<div className="calamar-table-header" style={{ paddingBottom: 48 }}>
					Account #{address}
				</div>
				<InfoTable
					item={accountCheck}
					loading={loading}
					noItemMessage="No account found"
				>
					<TableBody>
						{encodedAddress && (
							<TableRow>
								<TableCell>Address</TableCell>
								<TableCell>
									{encodedAddress}
									<span style={{ marginLeft: 8 }}>
										<CopyToClipboardButton value={encodedAddress} />
									</span>
								</TableCell>
							</TableRow>
						)}
						{encoded42Address && (
							<TableRow>
								<TableCell>Address (42 prefix)</TableCell>
								<TableCell>
									{encoded42Address}
									<span style={{ marginLeft: 8 }}>
										<CopyToClipboardButton value={encoded42Address} />
									</span>
								</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell>Raw address</TableCell>
							<TableCell>
								{address}
								<span style={{ marginLeft: 8 }}>
									<CopyToClipboardButton value={address || ""} />
								</span>
							</TableCell>
						</TableRow>
					</TableBody>
				</InfoTable>
			</Card>
			{extrinsics.items.length > 0 && (
				<Card>
					<div className="calamar-table-header" style={{ paddingBottom: 48 }}>
						Extrinsics
					</div>
					<ExtrinsicsTable
						columns={["id", "name", "time"]}
						items={extrinsics.items}
						loading={extrinsics.loading}
						network={network}
						pagination={extrinsics.pagination}
					/>
				</Card>
			)}
		</>
	);
}

export default AccountPage;
