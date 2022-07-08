import React from "react";
import { useParams } from "react-router-dom";
import EventsTable from "../components/events/EventsTable";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";

function SearchByNamePage() {
  let { name } = useParams();

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
      {extrinsics.items.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <ExtrinsicsTable
            items={extrinsics.items}
            pagination={extrinsics.pagination}
            title={
              <span>
                Extrinsics with the name{" "}
                <span style={{ fontWeight: "normal" }}>{name}</span>
              </span>
            }
          />
        </div>
      )}
      {events.items.length > 0 && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <EventsTable
            items={events.items}
            pagination={events.pagination}
            title={
              <span>
                Events with the name{" "}
                <span style={{ fontWeight: "normal" }}>{name}</span>
              </span>
            }
          />
        </div>
      )}
    </ResultLayout>
  );
}

export default SearchByNamePage;
