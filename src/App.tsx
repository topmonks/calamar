import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Dashboard from "./screens/dashboard";
import ExtrinsicPage from "./screens/extrinsic";
import BlockPage from "./screens/block";
import AccountPage from "./screens/account";
import Dev from "./screens/dev";
import NotFound from "./screens/notFound";
import ExtrinsicsByNamePage from "./screens/extrinsicsByName";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter
        basename={
          window.location.hostname === "localhost"
            ? undefined
            : process.env.PUBLIC_URL
        }
      >
        <Routes>
          <Route element={<ExtrinsicPage />} path="/extrinsic/:id" />
          <Route
            element={<ExtrinsicsByNamePage />}
            path="/extrinsics-by-name/:name"
          />
          <Route element={<BlockPage />} path="/block/:id" />
          <Route element={<AccountPage />} path="/account/:address" />
          <Route element={<Dev />} path="/dev" />
          <Route element={<Dashboard />} path="/" />
          <Route element={<NotFound />} path="*" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
