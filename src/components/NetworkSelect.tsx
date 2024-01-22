/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useState } from "react";
import { Button, ButtonProps, Checkbox, Divider, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import { BlurOn as AllIcon, ArrowDropDown } from "@mui/icons-material";
import { css } from "@emotion/react";

import { Network } from "../model/network";

import { useNetworks } from "../hooks/useNetworks";

const buttonStyle = css`
	display: flex;
	gap: 12px;

	padding-left: 16px;
	padding-right: 8px;

	border-radius: 8px;
	border: solid 1px #bdbdbd;

	font-size: 1rem;
	font-weight: 400;

	&, &:hover {
		background-color: ${grey[100]};
	}
`;

const menuItemStyle = css`
	.MuiListItemIcon-root {
		min-width: 0px;
		margin-right: 16px;
	}

	.MuiListItemText-root {
		margin-right: 24px;
	}
`;

const iconStyle = css`
	width: 20px;
	height: 20px;

	border-radius: 0px;
`;

const checkboxStyle = css`
	margin: -6px -16px;
	margin-left: auto;

	padding-top: 6px;
	padding-bottom: 6px;
	padding-right: 16px;

	font-weight: 400;

	&::before {
		content: " ";
		position: absolute;
		left: 0;
		height: 65%;
		width: 1px;
		background-color: rgba(0, 0, 0, .2);
	}

	.MuiMenuItem-root:not(:hover):not(:focus) &::before {
		display: none;
	}
`;

interface NetworkSelectProps extends Omit<ButtonProps, "value" | "onChange"> {
	value: Network[];
	multiselect?: boolean;
	onChange: (value: Network[], isUserAction: boolean) => void;
}

export const NetworkSelect = (props: NetworkSelectProps) => {
	const { value, multiselect, onChange, ...buttonProps } = props;

	const networks = useNetworks();

	const [anchorEl, setAnchorEl] = useState<HTMLElement>();

	const handleClose = useCallback(() => setAnchorEl(undefined), []);

	const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	}, []);

	const setSelection = useCallback((selected: Network[]) => {
		const newValue = [];

		for (const network of networks) {
			if (selected.includes(network)) {
				newValue.push(network);
			}
		}

		onChange?.(newValue, true);
		handleClose();
	}, [networks, onChange]);

	const addSelection = useCallback((selected: Network[]) => {
		const newValue = [];

		for (const network of networks) {
			if (selected.includes(network) || value.includes(network)) {
				newValue.push(network);
			}
		}

		onChange?.(newValue, true);
	}, [value, networks, onChange]);

	const removeSelection = useCallback((selected: Network[]) => {
		const newValue = [];

		for (const network of networks) {
			if (value.includes(network) && !selected.includes(network)) {
				newValue.push(network);
			}
		}

		onChange?.(newValue, true);
	}, [value, networks, onChange]);

	const handleItemClick = useCallback((network: Network, event: React.MouseEvent) => {
		if ("key" in event && event.key === " ") {
			if (value.includes(network)) {
				removeSelection([network]);
			} else {
				addSelection([network]);
			}

			return;
		}

		setSelection([network]);
	}, [value, addSelection, setSelection]);

	useEffect(() => {
		if(value.length === 0 && networks.length === 1) {
			onChange([networks[0]!], false);
		}
	}, [networks, value]);

	const open = !!anchorEl;

	console.log("value", value);

	return (
		<>
			<Button
				{...buttonProps}
				id="basic-button"
				aria-controls={open ? "networks-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				css={buttonStyle}
			>
				{value.length === 0 && (
					<>
						<AllIcon css={[iconStyle, {color: "#e6007a"}]} />
						<span>All networks</span>
					</>
				)}
				{value.length === 1 && (
					<>
						<img src={value[0]?.icon} css={iconStyle} />
						<span>{value[0]?.displayName}</span>
					</>
				)}
				{value.length > 1 && (
					<>
						{value.slice(0, 3).map((network) => <img src={network.icon} css={iconStyle} key={network.name} />)}
						{value.length > 3 && <span>+ {value.length - 3} other</span>}
					</>
				)}
				<ArrowDropDown />
			</Button>
			<Menu
				id="networks-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{networks.length > 1 && multiselect && [
					<MenuItem
						css={menuItemStyle}
						selected={value.length === 0}
						onClick={() => setSelection([])}
						key={"all"}
					>
						<ListItemIcon>
							<AllIcon css={[iconStyle, {color: "#e6007a"}]} />
						</ListItemIcon>
						<ListItemText>All networks</ListItemText>
					</MenuItem>,
					<Divider key="all-divider" />
				]}
				{networks.map((network) => (
					<MenuItem
						css={menuItemStyle}
						selected={value.includes(network)}
						onClick={(ev) => handleItemClick(network, ev)}
						key={network.name}
					>
						<ListItemIcon>
							<img
								src={network.icon}
								css={iconStyle}
							/>
						</ListItemIcon>
						<ListItemText>{network.displayName}</ListItemText>
						{networks.length > 1 && multiselect && (
							<Checkbox
								css={checkboxStyle}
								checked={value.includes(network)}
								onChange={(ev, checked) => checked ? addSelection([network]) : removeSelection([network])}
								onClick={(ev) => ev.stopPropagation()}
								disableRipple
							/>
						)}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};
