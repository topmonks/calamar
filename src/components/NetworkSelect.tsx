/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo } from "react";
import { capitalize, ListItemIcon, ListItemText, MenuItem, Select, SelectProps } from "@mui/material";
import { css, Theme } from "@emotion/react";

import { useArchives } from "../hooks/useArchives";
import { useNetworks } from "../hooks/useNetworks";

const selectStyle = (theme: Theme) => css`
	&.MuiInputBase-root {
		.MuiSelect-select {
			display: flex;
			align-items: center;
			padding-left: 16px;
			font-size: 18px;
		}
	}

	.MuiListItemIcon-root {
		min-width: 36px;

		img {
			width: 24px;
			height: 24px;
		}
	}

	${theme.breakpoints.down("sm")} {
		.MuiListItemIcon-root {
			min-width: 0;
		}

		.MuiListItemText-root {
			display: none;
		}
	}
`;

const iconStyle = css`
	width: 20px;
	height: 20px;

	border-radius: 4px;
`;

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

	const items = useMemo(() => {
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
			css={selectStyle}
		>
			{items.map((item) => (
				<MenuItem key={item.value} value={item.value}>
					<ListItemIcon>
						<img
							src={`https://raw.githubusercontent.com/subsquid/archive-registry/main/ui/logos/networks/${item.value}.png`}
							css={iconStyle}
						/>
					</ListItemIcon>
					<ListItemText>{item.label}</ListItemText>
				</MenuItem>
			))}
		</Select>
	);
};

export default NetworkSelect;
