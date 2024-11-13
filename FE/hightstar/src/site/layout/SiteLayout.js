import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import HomePage from "../views/home/HomePage";
import "../css/style.css"

const SiteLayout = () => {
  return (
    <div className="container-fluid vh-100">
      {/* Các định tuyến bên trong site */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to={"/"} />} />
        <Route path="*" element={<Navigate to={"/page404"} />} />
      </Routes>
      <Outlet /> {/* Để hiển thị các component con */}
    </div>
  );
};

export default SiteLayout;
