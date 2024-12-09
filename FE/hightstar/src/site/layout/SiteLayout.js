import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import "../css/style.css"; // Import CSS của bạn
import Header from "../components/Header";
import Footer from "../components/Footer";
import Home from "../views/homes/Home";
import About from "../views/about/About";
import BackToTop from "../../common/components/BackToTop";
import Contact from "../views/contacts/Contact";
import Course from "../views/courses/Course";
import CourseDetail from "../views/courses/CourseDetail";
import VietQRGenerator from "../views/Payment/VietQRGenerator";
import TransactionHistory from "../views/Payment/TransactionHistory";

const SiteLayout = () => {
  return (
    <div className="container-fluid g-0 vh-100 bg-white">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to={"/"} />} />
        <Route path="/about" element={<About />} />
        <Route path="/course" element={<Course />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/generator-qr" element={<VietQRGenerator />} /> */}
        {/* <Route path="/transaction" element={<TransactionHistory />} /> */}
        <Route path="*" element={<Navigate to={"/page404"} />} />
      </Routes>
      <Outlet />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default SiteLayout;
