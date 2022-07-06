import React from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";

function AccountPage() {
  let { address } = useParams();
  const filter = { signer: { _eq: address } };

  return (
    <div>
      <ExtrinsicsTable
        columns={["id", "section", "method", "time"]}
        filter={filter}
        order={{ created_at: "desc" }}
      />
    </div>
  );
}

export default AccountPage;
