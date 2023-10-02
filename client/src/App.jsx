import "./App.css";
import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
// import HomePage from "./HomePage";
import Users from "./pages/Users.jsx";
import Info from "./pages/Info.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="Users" element={<Users />}>
          <Route path=":id/Info" element={<Info />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
