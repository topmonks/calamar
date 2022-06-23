import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsTable from "./components/events/EventsTable";
import { RecoilRoot } from "recoil";
import Dashboard from "./screens/dashboard";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route element={<EventsTable />} path="/events" />
          <Route element={<></>} path="/transactions" />
          <Route element={<></>} path="/blocks" />
          <Route element={<Dashboard />} path="/" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
