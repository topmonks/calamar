import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

import { useExtrinsics } from "../hooks/useExtrinsics";
import { useEvents } from "../hooks/useEvents";
import { getBlock } from "../services/blocksService";
import { getExtrinsic } from "../services/extrinsicsService";

import Spinner from "./Spinner";
import SearchByNameResults from "./SearchByNameResults";

const StyledSearchBox = styled.div`
  padding: 32px 0;
  text-align: center;
  font-size: 24px;
  word-break: break-all;
`;

type SearchProps = {
  query: string;
};

const Search = (props: SearchProps) => {
  const { query } = props;

  const navigate = useNavigate();

  const [searchByName, setSearchByName] = useState<boolean>(false);
  const [singleNotFound, setSingleNotFound] = useState<boolean>(false);
  const [showResultsByName, setShowResultsByName] = useState<boolean>(false);

  const search = useCallback(
    async (query: string | null) => {
      if (!query) {
        return;
      }

      if (query.startsWith("0x")) {
        const extrinsicByHash = await getExtrinsic({ hash_eq: query });

        if (extrinsicByHash) {
          return navigate(`/extrinsic/${extrinsicByHash.id}`);
        }

        const blockByHash = await getBlock({ hash_eq: query });

        if (blockByHash) {
          return navigate(`/block/${blockByHash.id}`);
        }

        const extrinsicByAccount = await getExtrinsic({
          OR: [
            { signature_jsonContains: `{"address": "${query}" }` },
            { signature_jsonContains: `{"address": { "value": "${query}"} }` },
          ],
        });

        if (extrinsicByAccount) {
          return navigate(`/account/${query}`);
        }

        setSingleNotFound(true);
      }

      if (query.match(/^\d+$/)) {
        const blockByHeight = await getBlock({ height_eq: parseInt(query) });

        if (blockByHeight) {
          return navigate(`/block/${blockByHeight.id}`);
        }

        setSingleNotFound(true);
      }

      setSearchByName(true);
    },
    [navigate]
  );

  const extrinsicsByName = useExtrinsics(
    {
      call: {
        name_eq: query,
      },
    },
    "id_DESC",
    { skip: !searchByName }
  );

  const eventsByName = useEvents({ name_eq: query }, "id_DESC", {
    skip: !searchByName,
  });

  useEffect(() => {
    search(query);
  }, [query, search]);

  useEffect(() => {
    if (extrinsicsByName.items.length > 0 || eventsByName.items.length > 0) {
      setShowResultsByName(true);
    }
  }, [extrinsicsByName, eventsByName]);

  const loadingByName = useMemo(
    () => extrinsicsByName.loading || eventsByName.loading,
    [extrinsicsByName, eventsByName]
  );

  const notFound = useMemo(
    () =>
      singleNotFound ||
      (!loadingByName &&
        extrinsicsByName.items.length === 0 &&
        eventsByName.items.length === 0),
    [singleNotFound, loadingByName, extrinsicsByName, eventsByName]
  );

  console.log("EBN", eventsByName);

  return (
    <>
      {loadingByName && !showResultsByName && (
        <div
          className="calamar-card"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <StyledSearchBox>
            <div style={{ marginBottom: 40 }}>
              <strong>Searching for</strong>{" "}
              <span style={{ fontWeight: "normal" }}>
                <q lang="en">{query}</q>
              </span>
            </div>
            <Spinner />
          </StyledSearchBox>
        </div>
      )}
      {notFound && (
        <>
          <div className="calamar-card">
            <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
              Not found
            </div>
            <div>
              Nothing was found{" "}
              {query && <span>for query &quot;{query}&quot;</span>}
            </div>
          </div>
        </>
      )}
      {showResultsByName && (
        <SearchByNameResults
          events={eventsByName}
          extrinsics={extrinsicsByName}
          name={query!}
        />
      )}
    </>
  );
};

export default Search;
