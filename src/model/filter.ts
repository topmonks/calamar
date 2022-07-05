interface CommonFilter<T> {
  _eq?: T;
  _lt?: T;
  _lte?: T;
  _gt?: T;
  _gte?: T;
  _in?: T[];
  _is_null?: boolean;
  _neq?: T;
  _nin?: T[];
}

interface StringFilter extends CommonFilter<string> {
  _ilike?: string;
  _iregex?: string;
  _like?: string;
  _regex?: string;
  _similar?: string;
  _nilike?: string;
  _niregex?: string;
  _nlike?: string;
  _nregex?: string;
  _nsimilar?: string;
}

export type PropertyFilter<T> = T extends string
  ? StringFilter
  : CommonFilter<T>;

export type FilterWithoutLogical<T> = {
  [K in keyof T as Exclude<K, "_and" | "_or" | "_not">]?: T[K];
};

export type Filter<T> = {
  [K in keyof T]?: T[K] extends Filter<object>
    ? FilterWithoutLogical<T[K]>
    : PropertyFilter<T[K]>;
} & {
  _and?: Filter<T>;
  _or?: Filter<T>;
  _not?: Filter<T>;
};
