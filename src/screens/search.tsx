import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import ResultLayout from "../components/ResultLayout";
import Search from "../components/Search";

function SearchPage() {
  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  if (!query) {
    return <Navigate to="/" />;
  }

  return (
    <ResultLayout>
      <Search key={query} query={query} />
    </ResultLayout>
  );
}

export default SearchPage;
