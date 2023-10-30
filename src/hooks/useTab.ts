import { useCallback } from "react";

import { useParam } from "./useParam";

export type UseTabParamOptions = {
	paramName?: string;
	preserveQueryParams?: string[];
}

export function useTab<T extends string>(options: UseTabParamOptions = {}) {
	const [value, setValue] = useParam(options.paramName || "tab");

	const setTab = useCallback((newValue: T) => {
		setValue(newValue, {
			preserveQueryParams: options.preserveQueryParams,
			replace: !value
		});
	}, [value, options.preserveQueryParams, setValue]);

	return [value, setTab] as const;
}
