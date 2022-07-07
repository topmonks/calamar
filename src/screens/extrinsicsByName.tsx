import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import ResultLayout from "../components/ResultLayout";
import { useEvents } from "../hooks/useEvents";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { getEvents } from "../services/eventsService";

import { getExtrinsics } from "../services/extrinsicsService";

function ExtrinsicsByNamePage() {
  let { name } = useParams();

  const extrinsicsByName = useExtrinsics(
    {
      call: {
        name_eq: name,
      },
    }
    //{ created_at: "desc" }
  );

  /*const extrinsicsByEventName = useExtrinsics({
    substrate_events: {
      name: { _eq: name },
    },
  });*/

  console.log(extrinsicsByName);

  return (
    <ResultLayout>
      {extrinsicsByName.items.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <ExtrinsicsTable
            items={extrinsicsByName.items}
            pagination={extrinsicsByName.pagination}
            title={
              <span>
                Extrinsics with name{" "}
                <span style={{ fontWeight: "normal" }}>{name}</span>
              </span>
            }
          />
        </div>
      )}
      {/*extrinsicsByEventName.items.length > 0 && (
        <div style={{ marginTop: 16, marginBottom: 16 }}>
          <ExtrinsicsTable
            items={extrinsicsByEventName.items}
            pagination={extrinsicsByEventName.pagination}
            title={
              <span>
                Extrinsics with event <em>{name}</em>
              </span>
            }
          />
        </div>
      )*/}
    </ResultLayout>
  );
}

export default ExtrinsicsByNamePage;
