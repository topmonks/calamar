import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Devtools = () => {
	const [qs, setQs] = useSearchParams();

	useEffect(() => {
		if (qs.has("devtools")) {
			localStorage.setItem("devtools", qs.get("devtools")!);
			qs.delete("devtools");
			setQs(qs);
			window.location.reload();
		}
	}, [qs]);

	return null;
};
