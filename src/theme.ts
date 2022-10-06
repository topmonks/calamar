import { createTheme } from "@mui/material";
import { css } from "@emotion/react";

export const theme = createTheme({
	palette: {
		primary: {
			main: "#ff646d"
		}
	},
	typography: {
		fontFamily: "\"Open Sans\", sans-serif"
	},
	components: {
		MuiInputBase: {
			styleOverrides: {
				root: css`
					font-size: 18px;
				`,
				input: css`
					height: 24px;
					padding: 12px 16px;

					color: black;

					&::placeholder {
						color: #999999;
						opacity: 1;
					}
				`
			}
		},
		MuiSelect: {
			styleOverrides: {
				select: css`
					height: 24px;
					min-height: 24px;
				`
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: css`
					border-radius: 8px;
				`,
				input: css`
					border-radius: inherit;
					background-color: #f5f5f5;
					height: 24px;
					padding: 12px 16px;
				`,
				notchedOutline: css`
					border-color: #dcdcdc;
				`
			}
		},
	}
});
