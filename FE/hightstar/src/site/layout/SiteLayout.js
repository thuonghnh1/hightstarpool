import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "../css/style.css"; // Import CSS của bạn
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../views/home/Home";
import About from "../views/about/About";
import BackToTop from "../../common/components/BackToTop";

const SiteLayout = () => {
  return (
    <div className="container-fluid g-0 vh-100">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to={"/"} />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to={"/page404"} />} />
      </Routes>
      <Outlet />
      <Footer />

      <BackToTop/>
    </div>
  );

  
};

export default SiteLayout;
