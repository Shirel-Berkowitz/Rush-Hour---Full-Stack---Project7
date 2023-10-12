import "./App.css";
import React from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserList from "./pages/UserList.jsx";
import Users from "./pages/Users.jsx";
import Info from "./pages/Info.jsx";
import Cameras from "./pages/Cameras.jsx";
import Admin from "./pages/Admin.jsx";
import VideoAnalysis from "./pages/VideoAnalysis.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/UserList" element={<UserList />} />
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Admin" element={<Admin />}>
          <Route path=":id/Info" element={<Info />} />
          <Route path=":id/Cameras" element={<Cameras />}  />
          <Route path=":id/Cameras/:cameraID/VideoAnalysis" element={<VideoAnalysis />} /> 
          
        </Route>
        <Route path="/Users" element={<Users />}>
          <Route path=":id/Info" element={<Info />} />
          <Route path=":id/Cameras" element={<Cameras />} />
          {/* <Route path=":userID/:cameraID/VideoAnalysis" element={<VideoAnalysis />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
