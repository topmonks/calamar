import styled from "@emotion/styled";
import { Box, Tab, Tabs, styled as mstyled } from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import EventsTable from "../components/events/EventsTable";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

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
  &.Mui-selected {
    color: #14a1c0;
    font-weight: 700;
    background-color: #f5f5f5;
  }
`;

const StyledNoItemsMessage = styled.div`
  line-height: 54px;
  opacity: 0.75;
`;

function SearchByNamePage() {
  let { name } = useParams();

  const [tab, setTab] = useState<number>(0);

  const extrinsics = useExtrinsics(
    {
      call: {
        name_eq: name,
      },
    },
    {}, //{ created_at: "desc" }
    { skip: !name }
  );

  const events = useEvents({ name_eq: name });

  return (
    <ResultLayout>
      <div className="calamar-card" style={{ marginTop: 16, marginBottom: 16 }}>
        <div className="calamar-table-header" style={{ paddingBottom: 48 }}>
          Search by name <span style={{ fontWeight: "normal" }}>{name}</span>
        </div>
        <TabsBox style={{ marginTop: -16, marginBottom: 16 }}>
          <StyledTabs
            aria-label="basic tabs example"
            onChange={(event, tab) => setTab(tab)}
            style={{ marginBottom: -1 }}
            value={tab}
          >
            <StyledTab label="Extrinsics" />
            <StyledTab label="Events" />
          </StyledTabs>
        </TabsBox>
        {tab === 0 && (
          <div>
            {extrinsics.items.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <ExtrinsicsTable
                  items={extrinsics.items}
                  pagination={extrinsics.pagination}
                />
              </div>
            )}
            {extrinsics.items.length === 0 && (
              <StyledNoItemsMessage>No extrinsics found</StyledNoItemsMessage>
            )}
          </div>
        )}
        {tab === 1 && (
          <div>
            {events.items.length > 0 && (
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <EventsTable
                  items={events.items}
                  pagination={events.pagination}
                  showExtrinsic
                />
              </div>
            )}
            {events.items.length === 0 && (
              <StyledNoItemsMessage>No events found</StyledNoItemsMessage>
            )}
          </div>
        )}
      </div>
    </ResultLayout>
  );
}

export default SearchByNamePage;
