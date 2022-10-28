import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { Provider as RollbarProvider } from "@rollbar/react";

import HomePage from "./screens/home";
import ExtrinsicPage from "./screens/extrinsic";
import BlockPage from "./screens/block";
import AccountPage from "./screens/account";
import NotFoundPage from "./screens/notFound";
import SearchPage from "./screens/search";
import LatestExtrinsicsPage from "./screens/latestExtrinsics";
import ResultLayout from "./components/ResultLayout";
import { CallPage } from "./screens/call";
import { EventPage } from "./screens/event";
import { theme } from "./theme";
import { rollbarConfig } from "./rollbar";

function App() {
	return (
		<RollbarProvider config={rollbarConfig}>
			<ThemeProvider theme={theme}>
				<BrowserRouter
					basename={
						window.location.hostname === "localhost"
							? undefined
							: process.env.PUBLIC_URL
					}
				>
					<Routes>
						<Route element={<HomePage />} path="/" />
						<Route element={<ResultLayout />} path=":network">
							<Route element={<ExtrinsicPage />} path="extrinsic/:id" />
							<Route element={<SearchPage />} path="search" />
							<Route element={<BlockPage />} path="block/:id" />
							<Route element={<CallPage />} path="call/:id" />
							<Route element={<AccountPage />} path="account/:address" />
							<Route element={<EventPage />} path="event/:id" />
							<Route
								element={<LatestExtrinsicsPage />}
								path="latest-extrinsics"
							/>
							<Route element={<NotFoundPage />} path="*" />
							<Route element={<NotFoundPage />} index />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</RollbarProvider>
	);
}

export default App;
