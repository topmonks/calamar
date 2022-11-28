import { alpha, createTheme, darken, lighten } from "@mui/material";
import { grey } from "@mui/material/colors";
import { css } from "@emotion/react";

const customColors = {
	//neutral: "#e9e9e9"
	neutral: "#dddddd"
};

export const theme = createTheme({
	palette: {
		primary: {
			main: "#ff646d",
			contrastText: "#ffffff"
		},
		secondary: {
			main: "#14a1c0",
			contrastText: "#ffffff"
		},
		neutral: {
			main: customColors.neutral,
			dark: darken(customColors.neutral, 0.1),
			light: lighten(customColors.neutral, 0.1),
			contrastText: "rgba(0, 0, 0, 0.7)"
			//contrastText: "#ffffff"
		}
	},
	typography: {
		fontFamily: "\"Open Sans\", sans-serif",
		button: {
			fontSize: 18,
			fontWeight: 700,
			textTransform: "none"
		},
	},
	components: {
		MuiLink: {
			styleOverrides: {
				root: ({theme}) => css`
					font-weight: 700;
					font-family: "Google Sans", sans-serif;
					color: ${theme.palette.secondary.main};
				`
			}
		},
		MuiButton: {
			defaultProps: {
				color: "neutral",
				disableElevation: true,
			},
			variants: [
				{
					props: {color: "neutral", variant: "text"},
					style: ({theme}) => css`
						color: ${alpha(theme.palette.neutral.contrastText, .6)};
						background-color: ${alpha(theme.palette.neutral.main, .15)};

						&:hover {
							background-color: ${alpha(theme.palette.neutral.main, .45)};
						}
					`
				}
			],
			styleOverrides: {
				root: css`
					padding: 6px 32px;
				`,
				sizeSmall: css`
					padding: 2px 10px;
					font-size: 16px;
					font-weight: 400;
				`,
				text: ({theme, ownerState}) => css`
					${ownerState.color && ownerState.color !== "inherit" && css`
						${ownerState.size === "small" && css`
							color: ${theme.palette[ownerState.color].dark};
						`}

						background-color: ${alpha(theme.palette[ownerState.color].main, .075)};

						&:hover {
							background-color: ${alpha(theme.palette[ownerState.color].main, .15)};
						}
					`}
				`
			}
		},
		MuiToggleButton: {
			styleOverrides: {
				root: ({ownerState}) => {
					const color = (!ownerState.color || ownerState.color === "standard") ? "neutral" : ownerState.color;
					return css`
						border: none;
						background-color: ${theme.palette.neutral.main};
						padding: 6px 32px;

						&:hover {
							background-color: ${darken(theme.palette[color].main, 0.1)}
						}
					`;
				},
				selected: ({theme, ownerState}) => {
					const color = (!ownerState.color || ownerState.color === "standard") ? "neutral" : ownerState.color;
					return css`
						background-color: ${theme.palette[color].main};

						&:hover {
							background-color: ${darken(theme.palette[color].main, 0.2)}
						}
					`;
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: css`
					padding: 4px;
					border-radius: 4px;

					> svg {
						display: block;
					}
				`
			}
		},
		MuiButtonGroup: {
			defaultProps: {
				disableElevation: true,
			}
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				root: ({theme, ownerState}) => {
					const color = (!ownerState.color || ownerState.color === "standard") ? "neutral" : ownerState.color;
					return css`
						.MuiButtonBase-root {
							background-color: ${theme.palette.neutral.main};

							&:hover {
								background-color: ${darken(theme.palette.neutral.main, 0.05)};
							}

							&.Mui-selected {
								color: ${theme.palette[color].contrastText};
								background-color: ${color === "neutral" ? theme.palette.neutral.dark : theme.palette[color].main};

								&:hover {
									background-color: ${color === "neutral" ? theme.palette.neutral.dark : theme.palette[color].main};
								}
							}
						}
					`;
				}
			}
		},
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

					padding: 12px 24px;

					&& {
						padding-right: 40px;
					}
				`
			}
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: css`
					border-radius: 8px;

					&:hover {
						.MuiOutlinedInput-notchedOutline {
							border-color: ${grey[400]};
						}
					}

					&.Mui-focused {
						.MuiOutlinedInput-notchedOutline {
							border-width: 1px;
							border-color: ${grey[600]};
						}
					}
				`,
				input: css`
					border-radius: inherit;
					background-color: ${grey[100]};
					height: 24px;
					padding: 12px 16px;

					&:focus {
						border-radius: inherit;
					}
				`,
				notchedOutline: css`
					border-color: ${grey[300]};
				`,
			}
		},
		MuiTableRow: {
			styleOverrides: {
				root: css`
					&:last-child {
						> .MuiTableCell-body {
							border-bottom: none;
						}
					}
				`
			}
		},
		MuiTableCell: {
			styleOverrides: {
				root: css`
					font-size: 16px;
					line-height: 22px;
				`,
				head: css`
					font-weight: 700;
				`
			}
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: css`
					line-height: 20px;
					padding: 8px 16px;

					font-size: 16px;
					color: white;
					background-color: black;
				`,
				arrow: css`
					color: black!important;
				`
			}
		},
		MuiChip: {
			styleOverrides: {
				root: css`
					border: none;
					height: auto;
					font-size: 16px;
					justify-content: flex-start;
				`,
				icon: css`
					margin-left: 0;
					margin-right: -4px;
				`,
				label: css`
					padding-right: 0;
					white-space: normal;
				`
			}
		}
	}
});
