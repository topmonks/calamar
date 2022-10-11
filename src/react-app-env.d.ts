/// <reference types="react-scripts" />

import "@emotion/react";
import { Theme as MuiTheme } from "@mui/material";

declare module "@emotion/react" {
	export interface Theme extends MuiTheme {}
}
