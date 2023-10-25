import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function usePage() {
	const [qs, setQs] = useSearchParams();

	const page = parseInt(qs.get("page") || "1");

	const setPage = useCallback((page: number) => {
		console.log("set page", page);
		if (page === 1) {
			qs.delete("page");
		} else {
			qs.set("page", page.toString());
		}

		setQs(qs);
	}, [qs]);

	return useMemo(
		() => [page, setPage] as const,
		[page, setPage]
	);
}
