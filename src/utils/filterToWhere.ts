export const filterToWhere = (filter: any): string => {
  let where = "";
  for (let key in filter) {
    // @ts-ignore
    if (filter[key] instanceof Object) {
      where += `${key}: {`;
      // @ts-ignore
      where += filterToWhere(filter[key]);
      where += `}`;
    } else {
      // @ts-ignore
      if (filter[key] !== "") {
        // @ts-ignore
        where += `${key}: {_eq: ${filter[key]}}, `;
      }
    }
  }
  // where = where.slice(0, -2);
  where = where.replace(/"([^(")"]+)":/g, "$1:");
  return where;
};
