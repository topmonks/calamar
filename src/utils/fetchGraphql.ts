// import getSubdomain from "./getSubdomain";

export async function fetchGraphql(query: string) {
  let results = await fetch(
    // TODO: change when launch
    //`https://polkadot.indexer.gc.subsquid.io/v4/graphql`,
    `https://kusama.indexer.gc.subsquid.io/v4/graphql`,
    // `https://${getSubdomain()}.indexer.gc.subsquid.io/v4/graphql`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
      }),
    }
  );
  let jsonResult = await results.json();
  return jsonResult.data;
}
