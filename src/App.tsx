import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import HomePage from "./screens/home";
import ExtrinsicPage from "./screens/extrinsic";
import BlockPage from "./screens/block";
import AccountPage from "./screens/account";
import NotFoundPage from "./screens/notFound";
import SearchByNamePage from "./screens/searchByName";

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
            element={<SearchByNamePage />}
            path="/extrinsics-by-name/:name"
          />
          <Route element={<BlockPage />} path="/block/:id" />
          <Route element={<AccountPage />} path="/account/:address" />
          <Route element={<HomePage />} path="/" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
