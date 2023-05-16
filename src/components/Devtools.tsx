import { useEffect } from "react";

export const Devtools = () => {
	useEffect(() => {
		const url = new URL(window.location.href);
		if (url.searchParams.has("devtools")) {
			localStorage.setItem("devtools", url.searchParams.get("devtools")!);
			url.searchParams.delete("devtools");
			window.location.href = url.toString();
		}
	}, []);

	return null;
};
