import React, { useEffect } from "react";
import { getExtrinsics } from "../services/extrinsicsService";

function ExtrinsicsPage() {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const account = params.get("account");
  const name = params.get("name");

  const [extrinsics, setExtrinsics] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let filter = {};
      if (name) {
        filter = {
          _or: {
            substrate_events: { name: { _ilike: name } },
            name: { _ilike: name },
          },
        };
      } else if (account) {
        filter = {
          signer: { _eq: account },
        };
      }
      const extrinsics = await getExtrinsics(1, 0, filter);
      setExtrinsics(extrinsics);
    };
    fetchData();
  }, [account, name]);

  return <div>{extrinsics}</div>;
}

export default ExtrinsicsPage;
