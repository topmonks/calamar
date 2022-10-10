/// <reference types="react-scripts" />

import "@emotion/react";
import { Theme as MuiTheme, LinkTypeMap } from "@mui/material";

declare module "@emotion/react" {
	export interface Theme extends MuiTheme {}
}

declare module "@mui/material" {
	export interface LinkTypeMap<P = {}, D extends React.ElementType = "a"> {
		props: {
			x: number
		}
	}
}
