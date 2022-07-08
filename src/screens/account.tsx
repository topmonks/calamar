import React from "react";
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

function AccountPage() {
  let { address } = useParams();

  const extrinsics = useExtrinsics({
    OR: [
      { signature_jsonContains: `{"address": "${address}"}` },
      {
        signature_jsonContains: `{"address": { "value": "${address}"} }`,
      },
    ],
  });

  return (
    <ResultLayout>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Account
        </div>
        <TableContainer>
          <Table className="calamar-info-table">
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
          </Table>
        </TableContainer>
      </div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <ExtrinsicsTable
          columns={["id", "name", "time"]}
          items={extrinsics.items}
          pagination={extrinsics.pagination}
        />
      </div>
    </ResultLayout>
  );
}

export default AccountPage;
