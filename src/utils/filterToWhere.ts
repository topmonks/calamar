export const filterToWhere = (filter: any): string => {
  let where = "";
  for (let key in filter) {
    if (filter[key] instanceof Object) {
      where += `${key}: {`;
      where += filterToWhere(filter[key]);
      where += `},`;
    } else if (filter[key] !== "") {
      const isString = typeof filter[key] === "string";
      const value = isString ? `"${filter[key]}"` : filter[key];

      if (!key.startsWith("_")) {
        where += `${key}: {_eq: ${value}}, `;
      } else {
        where += `${key}: ${value}, `;
      }
    }
  }
  // where = where.slice(0, -2);
  where = where.replace(/"([^(")"]+)":/g, "$1:");
  return where;
};
