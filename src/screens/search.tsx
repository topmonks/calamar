import styled from "@emotion/styled";
import { CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResultLayout from "../components/ResultLayout";
import { getBlock } from "../services/blocksService";
import { getEvents } from "../services/eventsService";
import { getExtrinsic, getExtrinsics } from "../services/extrinsicsService";

const StyledSearchBox = styled.div`
  padding: 32px 0;
  text-align: center;
  font-size: 24px;
  word-break: break-all;
`;

const StyledSpinner = styled(CircularProgress)`
  color: #9af0f7;
`;

function SearchPage() {
  const [qs] = useSearchParams();
  const query = qs.get("query");
  console.log(qs, query);

  const navigate = useNavigate();

  const [extrinsics, setExtrinsics] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  const searchExtrinsicByHash = async (query: string) => {
    let extrinsic = await getExtrinsic({ hash_eq: query });

    if (extrinsic) {
      navigate(`/extrinsic/${extrinsic.id}`);
      return true;
    }
  };

  const searchBlockByHash = async (query: string) => {
    const block = await getBlock({ hash_eq: query });

    if (block) {
      navigate(`/block/${block.id}`);
      return true;
    }
  };

  const searchAccountByHash = async (query: string) => {
    const extrinsic = await getExtrinsic({
      signature_jsonContains: `{"address": { "value": "${query}"} }`,
    });

    if (extrinsic) {
      navigate(`/account/${query}`);
      return true;
    }
  };

  const searchBlockByHeight = async (query: string) => {
    if (!query.match(/\d+/)) {
      return;
    }

    const block = await getBlock({ height_eq: parseInt(query) });

    if (block) {
      navigate(`/block/${block.id}`);
      return true;
    }
  };

  const searchExtrinsicsByName = async (query: string) => {
    const extrinsics = await getExtrinsics(10, 0, {
      call: {
        name_eq: query,
      },
    });

    setExtrinsics(extrinsics);
  };

  const searchEventsByName = async (query: string) => {
    const events = await getEvents(10, 0, { name_eq: query });

    setEvents(events);
  };

  const search = async () => {
    if (!query) {
      return;
    }

    const found =
      (await searchExtrinsicByHash(query)) ||
      (await searchBlockByHash(query)) ||
      (await searchAccountByHash(query)) ||
      (await searchBlockByHeight(query));

    if (found) {
      return;
    }

    await searchExtrinsicsByName(query);
    await searchEventsByName(query);

    //return navigate(`/not-found?query=${query}`);
  };

  return (
    <ResultLayout>
      <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <StyledSearchBox>
          <div>
            <strong>Searching for</strong>{" "}
            <span style={{ fontWeight: "normal" }}>
              <q lang="en">{query}</q>
            </span>
          </div>
          <StyledSpinner size={54} style={{ marginTop: 40 }} thickness={6} />
        </StyledSearchBox>
      </div>
    </ResultLayout>
  );
}

export default SearchPage;
