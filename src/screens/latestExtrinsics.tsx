import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

import Card from "../components/Card";

type LatestExtrinsicsPageParams = {
	network: string;
};

function LatestExtrinsicsPage() {
	const { network } = useParams() as LatestExtrinsicsPageParams;
	const extrinsics = useExtrinsics(network, {}, "id_DESC");

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
					Latest extrinsics
				</div>
				<ExtrinsicsTable
					items={extrinsics.items}
					loading={extrinsics.loading}
					network={network}
					pagination={extrinsics.pagination}
				/>
			</Card>
		</>
	);
}

export default LatestExtrinsicsPage;
