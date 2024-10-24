import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import HomePage from "../views/home/HomePage";

const SiteLayout = () => {
  return (
    <div className="d-flex">
      {/* Các định tuyến bên trong site */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Outlet /> {/* Để hiển thị các component con */}
    </div>
  );
};

export default SiteLayout;
