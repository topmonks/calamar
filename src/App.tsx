import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsTable from "./components/events/EventsTable";
import { RecoilRoot } from "recoil";
import Dashboard from "./screens/dashboard";
import ExtrinsicPage from "./screens/extrinsic";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route element={<EventsTable />} path="/calamar/events" />
          <Route element={<ExtrinsicPage />} path="/calamar/extrinsic/:hash" />
          <Route element={<></>} path="/calamar/blocks" />
          <Route element={<Dashboard />} path="/calamar/" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
