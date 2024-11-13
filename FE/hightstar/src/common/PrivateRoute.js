import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, roles }) => {
  const [isAuthorized, setIsAuthorized] = useState(false); // Kiểm soát quyền truy cập
  const [isTokenValid, setIsTokenValid] = useState(false); // Kiểm soát trạng thái token
  const [isLoading, setIsLoading] = useState(true); // Kiểm soát trạng thái load

  const handleInvalidToken = (message) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userDetail");
    toast.warning(message);
    setIsTokenValid(false); // Đánh dấu token không hợp lệ
    setIsLoading(false); // Dừng trạng thái loading
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userDetail = JSON.parse(localStorage.getItem("userDetail"));

    if (!accessToken || !refreshToken || !userDetail) {
      handleInvalidToken("Vui lòng đăng nhập để tiếp tục!");
      return;
    }

    try {
      const decodedToken = jwtDecode(refreshToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        handleInvalidToken(
          "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!"
        );
      } else {
        setIsTokenValid(true); // Token hợp lệ
        if (roles && roles.includes(userDetail.role)) {
          setIsAuthorized(true); // Đủ quyền truy cập
        }
        setIsLoading(false); // Dừng trạng thái loading
      }
    } catch {
      handleInvalidToken("Token không hợp lệ, vui lòng đăng nhập lại!");
    }
  }, [roles]);

  // Khi đang load, trả về null hoặc một component loader nếu muốn
  if (isLoading) {
    return null; 
  }

  // Chuyển hướng đến trang đăng nhập nếu token không hợp lệ
  if (!isTokenValid) {
    return <Navigate to="/login" replace />;
  }

  // Nếu token hợp lệ nhưng không có quyền, điều hướng đến trang 403
  if (!isAuthorized) {
    return <Navigate to="/page403" replace />;
  }

  // Chỉ render `children` nếu token hợp lệ và có quyền
  return children;
};

export default PrivateRoute;
