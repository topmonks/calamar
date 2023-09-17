/** @jsxImportSource @emotion/react */
import { useCallback, useEffect } from "react";
import { Divider, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select, SelectProps } from "@mui/material";
import { BlurOn as AllIcon } from "@mui/icons-material";
import { css } from "@emotion/react";

import { useNetworks } from "../hooks/useNetworks";
import { useNetworkGroups } from "../hooks/useNetworkGroups";

const selectStyle = css`
	&.MuiInputBase-root {
		.MuiSelect-select {
			display: flex;
			align-items: center;
			padding-left: 16px;
		}
	}

	.MuiListItemIcon-root {
		min-width: 36px;

		img {
			width: 24px;
			height: 24px;
		}
	}

`;

const iconStyle = css`
	width: 20px;
	height: 20px;

	border-radius: 0px;
`;

type NetworkSelectProps = Omit<SelectProps, "value" | "onChange"> & {
	value: string | undefined;
	onChange: (value: string, isUserAction: boolean) => void;
};

const NetworkSelect = (props: NetworkSelectProps) => {
	const { value, onChange, ...selectProps } = props;

	const networkGroups = useNetworkGroups();

	useEffect(() => {
		if (!value) {
			onChange("*", false);
		}
	}, [value, onChange]);

	const handleNetworkChange = useCallback(
		(e: any) => {
			onChange && onChange(e.target.value, true);
		},
		[onChange]
	);

	return (
		<Select
			{...selectProps}
			onChange={handleNetworkChange}
			value={value || ""}
			css={selectStyle}
		>
			<MenuItem value="*">
				<ListItemIcon>
					<AllIcon css={{color: "#e6007a"}} />
				</ListItemIcon>
				<ListItemText>All networks</ListItemText>
			</MenuItem>
			<Divider />
			{networkGroups.map((group, index) => [
				index > 0 && <Divider />,
				<ListSubheader key={index}>
					{group.relayChainNetwork?.displayName || "Other"}
					{group.relayChainNetwork && <span> and parachains</span>}
				</ListSubheader>,
				...group.networks.map((network) => (
					<MenuItem key={network.name} value={network.name}>
						<ListItemIcon>
							<img
								src={network.icon}
								css={iconStyle}
							/>
						</ListItemIcon>
						<ListItemText>{network.displayName}</ListItemText>
					</MenuItem>
				))
			])}
		</Select>
	);
};

export default NetworkSelect;
