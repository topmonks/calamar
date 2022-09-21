import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TableBody, TableCell, TableRow, Tooltip } from "@mui/material";
import {
	convertTimestampToTimeFromNow,
	formatDate,
} from "../utils/convertTimestampToTimeFromNow";
import { useBlock } from "../hooks/useBlock";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import InfoTable from "../components/InfoTable";

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
			<div className="calamar-card">
				<div className="calamar-table-header" style={{ paddingBottom: 48 }}>
					Block #{id}
				</div>
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
									<span style={{ marginLeft: 8 }}>
										<CopyToClipboardButton value={block.hash} />
									</span>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Parent hash</TableCell>
								<TableCell>
									<Link to={`/${network}/search?query=${block.parentHash}`}>
										{block.parentHash}
									</Link>
									<span style={{ marginLeft: 8 }}>
										<CopyToClipboardButton value={block.parentHash} />
									</span>
								</TableCell>
							</TableRow>
							{block.validator && (
								<TableRow>
									<TableCell>Validator</TableCell>
									<TableCell>
										{block.validator}
										<span style={{ marginLeft: 8 }}>
											<CopyToClipboardButton value={block.validator} />
										</span>
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
			</div>
			{block && (
				<div
					className="calamar-card"
					style={{ marginTop: 16, marginBottom: 16 }}
				>
					<div className="calamar-table-header" style={{ paddingBottom: 48 }}>
						Extrinsics
					</div>
					<ExtrinsicsTable
						items={extrinsics.items}
						loading={extrinsics.loading}
						network={network}
						pagination={extrinsics.pagination}
					/>
				</div>
			)}
		</>
	);
}

export default BlockPage;
