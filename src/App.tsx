import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Dashboard from "./screens/dashboard";
import ExtrinsicPage from "./screens/extrinsic";
import BlockPage from "./screens/block";
import AccountPage from "./screens/account";

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
          <Route element={<BlockPage />} path="/block/:id" />
          <Route element={<AccountPage />} path="/account/:address" />
          <Route element={<Dashboard />} path="/" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
