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
      <BrowserRouter
        basename={
          window.location.hostname === "localhost"
            ? undefined
            : process.env.PUBLIC_URL
        }
      >
        <Routes>
          <Route element={<EventsTable />} path="/events" />
          <Route element={<ExtrinsicPage />} path="/extrinsic/:hash" />
          <Route element={<></>} path="/blocks" />
          <Route element={<Dashboard />} path="/" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
