import React, { useCallback, useMemo, useState } from "react";

export type PaginationState = {
	limit: number;
	offset: number;
	totalCount?: number
	hasNext: boolean;
};

export type Pagination = PaginationState & {
	setPreviousPage: () => void;
	setNextPage: () => void;
	setHasNext: (hasNext: boolean) => void;
	setTotalCount: (totalCount: number) => void;
	setPagination: (pagination: Pagination) => void;
};

export type UsePaginationProps = {
	limit?: number;
};

export function usePagination(limit = 10, hasNext = false) {
	const [pagination, setPaginationState] = useState<PaginationState>({
		limit,
		offset: 0,
		hasNext,
	});

	const setPreviousPage = useCallback(() => {
		if (pagination.offset === 0) {
			return;
		}
		setPaginationState({
			...pagination,
			offset: pagination.offset - pagination.limit,
		});
	}, [pagination]);

	const setNextPage = useCallback(() => {
		setPaginationState({
			...pagination,
			offset: pagination.offset + pagination.limit,
		});
	}, [pagination]);

	const setHasNext = useCallback(
		(hasNext: boolean) => {
			hasNext !== pagination.hasNext &&
				setPaginationState({
					...pagination,
					hasNext,
				});
		},
		[pagination]
	);

	const setTotalCount = useCallback(
		(totalCount: number) => {
			setPaginationState({
				...pagination,
				totalCount: totalCount,
			});
		},
		[pagination]
	);

	const setPagination = useCallback(
		(pagination: Pagination) => {
			setPaginationState(pagination);
		}, []
	);

	return useMemo(
		() =>
			({
				...pagination,
				setPreviousPage,
				setNextPage,
				setHasNext,
				setTotalCount,
				setPagination,
			} as Pagination),
		[pagination, setPreviousPage, setNextPage, setHasNext, setTotalCount, setPagination]
	);
}
