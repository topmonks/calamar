import { useCallback, useEffect } from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";

import { useArchives } from "../hooks/useArchives";

type NetworkSelectProps = Omit<SelectProps, "value" | "onChange"> & {
	value?: string;
	onChange?: (value: string, isUserAction: boolean) => void;
};

const NetworkSelect = (props: NetworkSelectProps) => {
	const { value, onChange, ...selectProps } = props;

	const archives = useArchives();

	useEffect(() => {
		const archive = archives.find((it) => it.network === value);

		if (!archive && onChange && archives.length > 0) {
			onChange(archives[0].network, false);
		}
	}, [value, onChange, archives]);

	const handleArchiveChange = useCallback(
		(e: any) => {
			onChange && onChange(e.target.value, true);
		},
		[onChange]
	);

	console.log(archives);

	return (
		<Select
			{...selectProps}
			onChange={handleArchiveChange}
			value={value || ""}
		>
			{archives.map((archive) => (
				<MenuItem key={archive.network} value={archive.network}>
					{archive.network}
				</MenuItem>
			))}
		</Select>
	);
};

export default NetworkSelect;
