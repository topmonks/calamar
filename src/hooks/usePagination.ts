import React, { useCallback, useMemo, useState } from "react";

export type PaginationState = {
	limit: number;
	offset: number;
	hasNext: boolean;
};

export type Pagination = PaginationState & {
	setPreviousPage: () => void;
	setNextPage: () => void;
	setHasNext: (hasNext: boolean) => void;
};

export type UsePaginationProps = {
	limit?: number;
};

export function usePagination(limit = 10, hasNext = false) {
	const [pagination, setPagination] = useState<PaginationState>({
		limit,
		offset: 0,
		hasNext,
	});

	const setPreviousPage = useCallback(() => {
		if (pagination.offset === 0) {
			return;
		}
		setPagination({
			...pagination,
			offset: pagination.offset - pagination.limit,
		});
	}, [pagination]);

	const setNextPage = useCallback(() => {
		setPagination({
			...pagination,
			offset: pagination.offset + pagination.limit,
		});
	}, [pagination]);

	const setHasNext = useCallback(
		(hasNext: boolean) => {
			hasNext !== pagination.hasNext &&
				setPagination({
					...pagination,
					hasNext,
				});
		},
		[pagination]
	);

	return useMemo(
		() =>
			({
				...pagination,
				setPreviousPage,
				setNextPage,
				setHasNext,
			} as Pagination),
		[pagination, setPreviousPage, setNextPage, setHasNext]
	);
}
