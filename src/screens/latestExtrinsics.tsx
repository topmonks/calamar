import React, { useEffect } from "react";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";

function LatestExtrinsicsPage() {
  const extrinsics = useExtrinsics({}, "id_DESC");

  useEffect(() => {
    if (extrinsics.pagination.offset === 0) {
      const interval = setInterval(extrinsics.refetch, 3000);
      return () => clearInterval(interval);
    }
  }, [extrinsics]);

  return (
    <ResultLayout>
      <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Latest extrinsics
        </div>
        <ExtrinsicsTable
          items={extrinsics.items}
          loading={extrinsics.loading}
          pagination={extrinsics.pagination}
        />
      </div>
    </ResultLayout>
  );
}

export default LatestExtrinsicsPage;
