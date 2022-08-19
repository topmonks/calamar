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
import { decodeAddress } from "../utils/formatAddress";

const StyledSearchBox = styled.div`
  padding: 32px 0;
  text-align: center;
  font-size: 24px;
  word-break: break-all;
`;

type SearchProps = {
  network: string;
  query: string;
};

const Search = (props: SearchProps) => {
  const { network, query } = props;

  const navigate = useNavigate();

  const [forceLoading, setForceLoading] = useState<boolean>(false);
  const [searchByName, setSearchByName] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [showResultsByName, setShowResultsByName] = useState<boolean>(false);

  const searchSingle = useCallback(
    async (query: string) => {
      query = query.replace(/\s/g, "");
      if (query.startsWith("0x")) {
        const extrinsicByHash = await getExtrinsic(network, { hash_eq: query });

        if (extrinsicByHash) {
          return `/${network}/extrinsic/${extrinsicByHash.id}`;
        }

        const blockByHash = await getBlock(network, { hash_eq: query });

        if (blockByHash) {
          return `/${network}/block/${blockByHash.id}`;
        }

        const extrinsicByAccount = await getExtrinsic(network, {
          OR: [
            { signature_jsonContains: `{"address": "${query}" }` },
            { signature_jsonContains: `{"address": { "value": "${query}"} }` },
          ],
        });

        if (extrinsicByAccount) {
          return `/${network}/account/${query}`;
        }

        setNotFound(true);
      }

      if (query.match(/^\d+$/)) {
        const blockByHeight = await getBlock(network, {
          height_eq: parseInt(query),
        });

        if (blockByHeight) {
          return `/${network}/block/${blockByHeight.id}`;
        }

        setNotFound(true);
      }

      const decodedAddress = decodeAddress(query);
      if (decodedAddress) {
        return `/${network}/account/${decodedAddress}`;
      }

      setSearchByName(true);
    },
    [network]
  );

  const extrinsicsByName = useExtrinsics(
    network,
    {
      call: {
        name_eq: query,
      },
    },
    "id_DESC",
    { skip: !searchByName }
  );

  const eventsByName = useEvents(network, { name_eq: query }, "id_DESC", {
    skip: !searchByName,
  });

  useEffect(() => {
    const search = async () => {
      setForceLoading(true);

      const [redirect] = await Promise.all([
        searchSingle(query),
        new Promise((resolve) => setTimeout(resolve, 1000)), // slow down search to show the spinner for a while (prevent flickering when the query is fast)
      ]);

      if (redirect) {
        return navigate(redirect, { replace: true });
      }

      setForceLoading(false);
    };

    search();
  }, [query, searchSingle, navigate]);

  useEffect(() => {
    if (extrinsicsByName.items.length > 0 || eventsByName.items.length > 0) {
      setShowResultsByName(true);
    } else if (!extrinsicsByName.loading && !eventsByName.loading) {
      setNotFound(true);
    }
  }, [extrinsicsByName, eventsByName]);

  const showLoading = useMemo(
    () => forceLoading || (!showResultsByName && !notFound),
    [forceLoading, showResultsByName, notFound]
  );

  return (
    <>
      {showLoading && (
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
      {!showLoading && notFound && (
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
      {!showLoading && showResultsByName && (
        <SearchByNameResults
          events={eventsByName}
          extrinsics={extrinsicsByName}
          name={query!}
          network={network}
        />
      )}
    </>
  );
};

export default Search;
