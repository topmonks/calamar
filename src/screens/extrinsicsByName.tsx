import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
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
    <>
      {extrinsicsByName.items.length > 0 && (
        <ExtrinsicsTable
          items={extrinsicsByName.items}
          pagination={extrinsicsByName.pagination}
          title={
            <span>
              Extrinsics with name <em>{name}</em>
            </span>
          }
        />
      )}
      {/*extrinsicsByEventName.items.length > 0 && (
        <ExtrinsicsTable
          items={extrinsicsByEventName.items}
          pagination={extrinsicsByEventName.pagination}
          title={
            <span>
              Extrinsics with event <em>{name}</em>
            </span>
          }
        />
        )*/}
    </>
  );
}

export default ExtrinsicsByNamePage;
