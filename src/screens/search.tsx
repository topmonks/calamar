import React from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import ResultLayout from "../components/ResultLayout";
import Search from "../components/Search";

type SearchPageParams = {
  network: string;
};

function SearchPage() {
  const { network } = useParams() as SearchPageParams;

  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  if (!query) {
    return <Navigate to="/" />;
  }

  return <Search key={`${network}-${query}`} network={network} query={query} />;
}

export default SearchPage;
