import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider as RollbarProvider } from "@rollbar/react";

import { Devtools } from "./components/Devtools";

import { theme } from "./theme";
import { rollbar } from "./rollbar";
import { router } from "./router";

function App() {
	return (
		<RollbarProvider instance={rollbar}>
			<ThemeProvider theme={theme}>
				<RouterProvider router={router} />
				<Devtools />
			</ThemeProvider>
		</RollbarProvider>
	);
}

export default App;
