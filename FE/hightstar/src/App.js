// import { Routes, Route } from "react-router-dom";
import AdminLayout from "./admin/layout/AdminLayout";
import SiteLayout from "./site/layout/SiteLayout";
import "./admin/css/style.css";

function App() {
  return (
    <div className="">
      <SiteLayout />
      <AdminLayout />
    </div>
  );
}

export default App;
