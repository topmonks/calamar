import React from "react";
import { useParams } from "react-router-dom";
import OldExtrinsicsTable from "../components/extrinsics/OldExtrinsicsTable";

function AccountPage() {
  let { address } = useParams();
  const filter = { signer: { _eq: address } };

  return (
    <div>
      <OldExtrinsicsTable
        columns={["id", "section", "method", "time"]}
        filter={filter}
        order={{ created_at: "desc" }}
      />
    </div>
  );
}

export default AccountPage;
