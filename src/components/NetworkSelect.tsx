import { useCallback, useEffect } from "react";
import { MenuItem, Select, SelectProps } from "@mui/material";
import styled from "@emotion/styled";
import cx from "classnames";

import { useArchives } from "../hooks/useArchives";

const StyledSelect = styled(Select)`
	/*border-radius: 8px !important;
	overflow: hidden;

	background-color: #61dafb !important;
	border-color: #14a1c0;
	border-color: green;
	text-transform: capitalize !important;

	& .MuiOutlinedInput-root {
		&.Mui-focused fieldset {
			border-color: green;
		}
	}*/
`;

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

	return (
		<StyledSelect
			{...selectProps}
			//className={cx("calamar-button", props.className)}
			onChange={handleArchiveChange}
			//size="small"
			value={value || ""}
		>
			{archives.map((archive) => (
				<MenuItem key={archive.network} value={archive.network}>
					{archive.network}
				</MenuItem>
			))}
		</StyledSelect>
	);
};

export default NetworkSelect;
