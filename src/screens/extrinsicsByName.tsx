import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ExtrinsicsTable from "../components/extrinsics/ExtrinsicsTable";
import { useExtrinsics } from "../hooks/useExtrinsics";
import { getEvents } from "../services/eventsService";

import { getExtrinsics } from "../services/extrinsicsService";

function ExtrinsicsByNamePage() {
  let { name } = useParams();

  useExtrinsics({ name: { _eq: name } });

  const [extrinsicsByName, setExtrinsicsByName] = React.useState([]);
  const [extrinsicsByEventName, setExtrinsicsByEventName] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const extrinsicsByName = await getExtrinsics(10, 0, {
        name: { _eq: name },
      });

      const eventsByName = await getEvents(10, 0, {
        name: { _eq: name },
      });

      setExtrinsicsByName(extrinsicsByName);

      const extrinsicsByEventName = eventsByName.map(
        (event: any) => event.extrinsic
      );
      setExtrinsicsByEventName(extrinsicsByEventName);
    };

    fetchData();
  }, [name]);

  console.log(extrinsicsByName);

  return (
    <>
      {extrinsicsByName.length > 0 && (
        <ExtrinsicsTable
          data={extrinsicsByName}
          title={
            <span>
              Extrinsics with name <em>{name}</em>
            </span>
          }
        />
      )}
      {extrinsicsByEventName.length > 0 && (
        <ExtrinsicsTable
          data={extrinsicsByEventName}
          title={
            <span>
              Extrinsics with event <em>{name}</em>
            </span>
          }
        />
      )}
    </>
  );
}

export default ExtrinsicsByNamePage;
