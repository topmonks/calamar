import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { setLocationParams } from "../utils/router";

import { routes } from "../router";

export type UseSetParamValueOptions = {
	preserveQueryParams?: string[];
	replace?: boolean;
}

export function useParam<T extends string>(name: string) {
	const location = useLocation();
	const params = useParams();
	const navigate = useNavigate();

	const value = params[name] as T;

	const setValue = useCallback((newValue: T, options: UseSetParamValueOptions) => {
		const newPath = setLocationParams(location, {
			[name]: newValue
		}, routes);

		const qs = new URLSearchParams(location.search);
		const newQs = new URLSearchParams();

		for (const param of options.preserveQueryParams || []) {
			for (const values of qs.getAll(param)) {
				newQs.append(param, values);
			}
		}

		navigate({
			pathname: newPath,
			search: newQs.toString()
		}, {replace: options.replace});
	}, [location, params, navigate]);

	return [value, setValue] as const;
}
