import React, { useEffect } from "react";
import { useExtrinsics } from "../hooks/useExtrinsics";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import { useParams } from "react-router-dom";

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
      <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Latest extrinsics
        </div>
        <ExtrinsicsTable
          items={extrinsics.items}
          loading={extrinsics.loading}
          network={network}
          pagination={extrinsics.pagination}
        />
      </div>
    </>
  );
}

export default LatestExtrinsicsPage;
