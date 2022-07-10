import archivesJSON from "../archives.json";

export async function fetchGraphql(query: string, variables: object = {}) {
  const network = localStorage.getItem("network");
  let archive = archivesJSON.archives.find(
    (archive) => archive.network === network
  );

  if (!archive) {
    archive = archivesJSON.archives[0];
    localStorage.setItem("network", archivesJSON.archives[0].network);
  }

  let results = await fetch(archive.providers[0].explorerUrl, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      query,
      variables,
    }),
  });

  let jsonResult = await results.json();
  return jsonResult.data;
}
