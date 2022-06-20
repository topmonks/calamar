import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventsTable from "./components/EventsTable";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route element={<EventsTable />} path="/events" />
          <Route element={<></>} path="/transactions" />
          <Route element={<></>} path="/blocks" />
          <Route element={<></>} path="/" />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
