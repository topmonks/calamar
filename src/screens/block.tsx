import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";

import { Card, CardHeader } from "../components/Card";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import InfoTable from "../components/InfoTable";
import { Link } from "../components/Link";
import { useBlock } from "../hooks/useBlock";
import { useExtrinsics } from "../hooks/useExtrinsics";
import {
	convertTimestampToTimeFromNow,
	formatDate,
} from "../utils/convertTimestampToTimeFromNow";

type BlockPageParams = {
	network: string;
	id: string;
};

function BlockPage() {
	const { network, id } = useParams() as BlockPageParams;

	const [block, { loading }] = useBlock(network, { id_eq: id });

	const extrinsics = useExtrinsics(
		network,
		{ block: { id_eq: id } },
		"id_DESC"
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
				<CardHeader>Block #{id}</CardHeader>
				<InfoTable
					item={block}
					loading={loading}
					noItemMessage="No block found"
				>
					{block && (
						<TableBody>
							<TableRow>
								<TableCell>Id</TableCell>
								<TableCell>{block.id}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Hash</TableCell>
								<TableCell>
									{block.hash}
									<CopyToClipboardButton value={block.hash} />
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Parent hash</TableCell>
								<TableCell>
									<Link to={`/${network}/search?query=${block.parentHash}`}>
										{block.parentHash}
									</Link>
									<CopyToClipboardButton value={block.parentHash} />
								</TableCell>
							</TableRow>
							{block.validator && (
								<TableRow>
									<TableCell>Validator</TableCell>
									<TableCell>
										{block.validator}
										<CopyToClipboardButton value={block.validator} />
									</TableCell>
								</TableRow>
							)}
							<TableRow>
								<TableCell>Block height</TableCell>
								<TableCell>{block.height}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Date</TableCell>
								<TableCell>
									<Tooltip
										arrow
										placement="top"
										title={formatDate(block.timestamp)}
									>
										<span>
											{convertTimestampToTimeFromNow(block.timestamp)}
										</span>
									</Tooltip>
								</TableCell>
							</TableRow>
						</TableBody>
					)}
				</InfoTable>
			</Card>
			{block && (
				<Card>
					<CardHeader>Extrinsics</CardHeader>
					<ExtrinsicsTable
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

export default BlockPage;
