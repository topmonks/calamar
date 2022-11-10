import { useEffect } from "react";

export function useDOMEventTrigger(event: string, condition: boolean) {
	useEffect(() => {
		if (condition) {
			window.dispatchEvent(new CustomEvent(event));
		}
	}, [event, condition]);
}
