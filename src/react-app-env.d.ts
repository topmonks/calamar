/// <reference types="react-scripts" />

import "@emotion/react";
import { Theme as MuiTheme } from "@mui/material";

declare module "@emotion/react" {
	export interface Theme extends MuiTheme {}
}

declare module "@mui/material/styles" {
	interface Palette {
		neutral: Palette["primary"];
	}
	interface PaletteOptions {
		neutral: PaletteOptions["primary"];
	}
}

declare module "@mui/material/Button" {
	interface ButtonPropsColorOverrides {
		neutral: true;
	}
}

declare global {
	declare interface Window {
		env: {
			[key: string]: string|undefined
		};
	}
}
