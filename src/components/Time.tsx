import { useCallback, useEffect, useState } from "react";
import { format as formatTime, formatDistanceToNowStrict } from "date-fns";
import { Tooltip } from "@mui/material";

export type TimeProps = {
	time: Date|number;
	fromNow?: boolean;
	useTooltip?: string;
	format?: string;
	tooltipFormat?: string;
}

export const Time = (props: TimeProps) => {
	const {time, fromNow = false, useTooltip = fromNow, format = "PP pp", tooltipFormat = format} = props;

	const [formatted, setFormatted] = useState<string>();

	const setFromNow = useCallback(() => {
		setFromNow();
	}, []);

	useEffect(() => {
		if (fromNow) {
			const interval = setInterval(() =>
				setFormatted(formatDistanceToNowStrict(new Date(time), {addSuffix: true}))
			);

			return () => clearInterval(interval);
		}

		setFormatted(formatTime(new Date(time), format));
	}, [time, format, fromNow]);

	if (!useTooltip) {
		return <span data-test="time">{formatted}</span>;
	}

	return (
		<Tooltip
			arrow
			placement="top"
			enterTouchDelay={0}
			title={formatTime(new Date(time), tooltipFormat)}
		>
			<span data-test="time">{formatted}</span>
		</Tooltip>
	);
};
