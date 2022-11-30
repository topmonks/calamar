import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

import { Card, CardHeader } from "../components/Card";
import { useExtrinsicsWithoutTotalCount } from "../hooks/useExtrinsicsWithoutTotalCount";
import { useDOMEventTrigger } from "../hooks/useDOMEventTrigger";

type LatestExtrinsicsPageParams = {
	network: string;
};

function LatestExtrinsicsPage() {
	const { network } = useParams() as LatestExtrinsicsPageParams;
	const extrinsics = useExtrinsicsWithoutTotalCount(network, undefined, "id_DESC");

	useDOMEventTrigger("data-loaded", !extrinsics.loading);

	useEffect(() => {
		if (extrinsics.pagination.offset === 0) {
			const interval = setInterval(extrinsics.refetch, 3000);
			return () => clearInterval(interval);
		}
	}, [extrinsics]);

	return (
		<>
			<Card>
				<CardHeader>Latest extrinsics</CardHeader>
				<ExtrinsicsTable network={network} extrinsics={extrinsics} showAccount showTime />
			</Card>
		</>
	);
}

export default LatestExtrinsicsPage;
