import React from "react";
import { Grid } from "@mui/material";
import ResultLayout from "../components/ResultLayout";
import { useSearchParams } from "react-router-dom";

function NotFoundPage() {
  return (
    <>
      <div className="calamar-card">
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Page not found
        </div>
        <div>This page doesn&apos;t exist</div>
      </div>
    </>
  );
}

export default NotFoundPage;
