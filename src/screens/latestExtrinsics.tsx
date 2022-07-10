import React from "react";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";

function LatestExtrinsicsPage() {
  const extrinsics = useExtrinsics({}, "id_DESC");

  return (
    <ResultLayout>
      <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Latest extrinsics
        </div>
        <ExtrinsicsTable
          items={extrinsics.items}
          pagination={extrinsics.pagination}
        />
      </div>
    </ResultLayout>
  );
}

export default LatestExtrinsicsPage;
