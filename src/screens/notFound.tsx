import React from "react";
import { Grid } from "@mui/material";
import ResultLayout from "../components/ResultLayout";
import { useSearchParams } from "react-router-dom";

function NotFoundPage() {
  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  return (
    <ResultLayout>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Not found
        </div>
        <div>
          Nothing was found{" "}
          {query && <span>for query &quot;{query}&quot;</span>}
        </div>
      </div>
    </ResultLayout>
  );
}

export default NotFoundPage;
