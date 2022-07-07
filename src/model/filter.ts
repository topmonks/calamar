/*interface CommonFilterOperators<T> {
  _eq?: T;
  _lt?: T;
  _lte?: T;
  _gt?: T;
  _gte?: T;
  _in?: T[];
  _isNull?: boolean;
  _not_eq?: T;
  _not_in?: T[];
}

type PropertyFilter2<P extends string, FD extends CommonFilterOperators<any>> = {
  [OP in keyof FD as `${P}${string & OP}`]: FD[OP];
};

interface StringFilterOperators extends CommonFilterOperators<string> {
  _contains?: string;
  _containsInsensitive?: string;
  _startsWith?: string;
  _endsWith?: string;
  _not_contains?: string;
  _not_containsInsensitive?: string;
  _not_startsWith?: string;
  _not_endsWith?: string;
}

export type PropertyFilter<T> = T extends string
  ? StringFilterOperators
  : CommonFilterOperators<T>;

export type FilterWithoutLogical<T> = {
  [K in keyof T as Exclude<K, "_and" | "_or" | "_not">]?: T[K];
};

export type Filter<T> = {
  [K in keyof T]?: T[K] extends Filter<object> ? T[K] : PropertyFilter<K, T[K]>;
} & {
  _and?: Filter<T>;
  _or?: Filter<T>;
  _not?: Filter<T>;
};

const x: PropertyFilter2<"name", CommonFilterOperators<string>>;

const y: Filter<{
  a: string;
  b: number;
}>*/
export {};
