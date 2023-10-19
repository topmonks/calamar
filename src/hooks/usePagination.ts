import { useCallback, useMemo, useState } from "react";

export type PaginationState = {
	limit: number;
	offset: number;
	hasNextPage: boolean;
};

export type Pagination = PaginationState & {
	set: (pagination: Partial<PaginationState>) => void;
	setPreviousPage: () => void;
	setNextPage: () => void;
};

export type UsePaginationProps = {
	limit?: number;
};

export function usePagination(limit = 10) {
	const [state, setState] = useState<PaginationState>({
		limit,
		offset: 0,
		hasNextPage: false,
	});

	const setPreviousPage = useCallback(() => {
		if (state.offset === 0) {
			return;
		}
		setState({
			...state,
			offset: state.offset - state.limit,
		});
	}, [state]);

	const setNextPage = useCallback(() => {
		setState({
			...state,
			offset: state.offset + state.limit,
		});
	}, [state]);

	const set = useCallback((newState: Partial<Pagination>) => {
		setState({
			...state,
			...newState
		});
	}, [state]);

	return useMemo(
		() => ({
			...state,
			set,
			setPreviousPage,
			setNextPage,
		} as Pagination),
		[state, setPreviousPage, setNextPage, setState]
	);
}
