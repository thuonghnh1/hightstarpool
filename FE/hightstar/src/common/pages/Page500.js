import { NavLink } from "react-router-dom";

const Page404 = () => {
  const userDetail = JSON.parse(localStorage.getItem("userDetail"));

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">5<span> 0 </span>0</h1>
        <h1 className="mb-3 text-dark">Lỗi máy chủ!</h1>
        <p className="mb-4 fs-4 text-muted px-3">
          Xin lỗi, máy chủ hiện không phản hồi vui lòng thử lại sau.
        </p>
        <NavLink
          to={userDetail && userDetail.role === "ADMIN" ? "/admin/dashboard" : "/home"}
          className="btn btn-primary btn-lg"
        >
          <i className="bi bi-house-door-fill me-2"></i>
          Quay lại trang chủ
        </NavLink>
      </div>
    </div>
  );
};

export default Page404;
