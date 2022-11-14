import { useEffect } from "react";

export function useDOMEventTrigger(event: string, condition: boolean) {
	useEffect(() => {
		if (condition) {
			console.debug("dispatch event", event, condition);
			setTimeout(() => window.dispatchEvent(new CustomEvent(event)));
		}
	}, [event, condition]);
}
