import { useCallback, useEffect, useMemo } from "react";
import { capitalize, MenuItem, Select, SelectProps } from "@mui/material";

import { useArchives } from "../hooks/useArchives";
import { useNetworks } from "../hooks/useNetworks";

type NetworkSelectProps = Omit<SelectProps, "value" | "onChange"> & {
	value?: string;
	onChange?: (value: string, isUserAction: boolean) => void;
};

const NetworkSelect = (props: NetworkSelectProps) => {
	const { value, onChange, ...selectProps } = props;

	const archives = useArchives();
	const networks = useNetworks();

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

	const items = useMemo(() => {
		console.log("N", networks);
		return archives.map((archive) => {
			const network = networks.find((network) => network.name === archive.network);

			const label = network?.displayName.replace(/ relay chain/i, "") || capitalize(archive.network);

			return {
				value: archive.network,
				label
			};
		});
	}, [archives, networks]);

	return (
		<Select
			{...selectProps}
			onChange={handleArchiveChange}
			value={value || ""}
		>
			{items.map((item) => (
				<MenuItem key={item.value} value={item.value}>
					{item.label}
				</MenuItem>
			))}
		</Select>
	);
};

export default NetworkSelect;
