import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import { useExtrinsics } from "../hooks/useExtrinsics";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import CopyToClipboardButton from "../components/CopyToClipboardButton";
import InfoTable from "../components/InfoTable";
import { useExtrinsic } from "../hooks/useExtrinsic";

function AccountPage() {
  let { address } = useParams();

  const filter = {
    OR: [
      { signature_jsonContains: `{"address": "${address}" }` },
      { signature_jsonContains: `{"address": { "value": "${address}"} }` },
    ],
  };

  const [accountCheck, { loading }] = useExtrinsic(filter);
  const extrinsics = useExtrinsics(filter);

  useEffect(() => {
    if (extrinsics.pagination.offset === 0) {
      const interval = setInterval(extrinsics.refetch, 3000);
      return () => clearInterval(interval);
    }
  }, [extrinsics]);

  return (
    <ResultLayout>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Account #{address}
        </div>
        <InfoTable
          item={accountCheck}
          loading={loading}
          noItemMessage="No account found"
        >
          <TableBody>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>
                {address}

                <span style={{ marginLeft: 8 }}>
                  <CopyToClipboardButton value={address || ""} />
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </InfoTable>
      </div>
      {extrinsics.items.length > 0 && (
        <div
          className="calamar-card"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
            Extrinsics
          </div>
          <ExtrinsicsTable
            columns={["id", "name", "time"]}
            items={extrinsics.items}
            loading={extrinsics.loading}
            pagination={extrinsics.pagination}
          />
        </div>
      )}
    </ResultLayout>
  );
}

export default AccountPage;
