import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import styled from "@emotion/styled";

import EventsTable from "./events/EventsTable";
import ExtrinsicsTable from "./extrinsics/ExtrinsicsTable";
import ResultLayout from "./ResultLayout";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import Spinner from "./Spinner";

const TabsBox = styled.div`
  border-bottom: solid 1px rgba(0, 0, 0, 0.12);
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    height: 3px;
    background-color: #14a1c0;
  }
`;

const StyledTab = styled(Tab)`
  display: flex;
  flex-direction: row;
  align-items: center;

  &.Mui-selected {
    color: #14a1c0;
    font-weight: 700;
    background-color: #f5f5f5;

    .MuiCircularProgress-root {
      color: #14a1c0;
    }
  }

  .MuiCircularProgress-root {
    color: rgba(0, 0, 0, 0.6);
    margin-top: -3px;
    margin-left: 8px;
  }
`;

type SearchByNameResultsProps = {
  name: string;
  extrinsics: ReturnType<typeof useExtrinsics>;
  events: ReturnType<typeof useEvents>;
};

function SearchByNameResults(props: SearchByNameResultsProps) {
  const { name, extrinsics, events } = props;

  const [tab, setTab] = useState<string | undefined>(undefined);

  const tabHandles: ReactElement[] = [];
  const tabPanes: ReactElement[] = [];

  if (extrinsics.loading || extrinsics.items.length > 0) {
    tabHandles.push(
      <StyledTab
        key="extrinsics"
        label={
          <>
            <span>Extrinsics</span>
            {extrinsics.loading && <CircularProgress size={14} />}
          </>
        }
        value="extrinsics"
      />
    );

    tabPanes.push(
      <ExtrinsicsTable
        items={extrinsics.items}
        key="extrinsics"
        loading={extrinsics.loading}
        pagination={extrinsics.pagination}
      />
    );
  }

  if (events.loading || events.items.length > 0) {
    tabHandles.push(
      <StyledTab
        key="events"
        label={
          <>
            <span>Events</span>
            {events.loading && <CircularProgress size={14} />}
          </>
        }
        value="events"
      />
    );

    tabPanes.push(
      <EventsTable
        items={events.items}
        key="events"
        loading={events.loading}
        pagination={events.pagination}
        showExtrinsic
      />
    );
  }

  useEffect(() => {
    if (extrinsics.items.length > 0) {
      setTab("extrinsics");
    } else if (events.items.length > 0) {
      setTab("events");
    }
  }, [extrinsics, events]);

  return (
    <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
      <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
        Results for name <span style={{ fontWeight: "normal" }}>{name}</span>
      </div>
      <TabsBox style={{ marginTop: -16, marginBottom: 16 }}>
        <StyledTabs
          aria-label="basic tabs example"
          onChange={(event, tab) => setTab(tab)}
          style={{ marginBottom: -1 }}
          value={tab || tabHandles[0]!.props.value}
        >
          {tabHandles}
        </StyledTabs>
      </TabsBox>
      {tab ? tabPanes.find((it) => it.key === tab) : tabPanes[0]}
    </div>
  );
}

export default SearchByNameResults;
