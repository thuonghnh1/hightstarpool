import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const useCheckRefreshTokenExp = () => {
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const handleInvalidToken = (message) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userDetail");
      toast.warning(message);
    };

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
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
        setIsTokenValid(true);
      }
    } catch {
      handleInvalidToken("Token không hợp lệ, vui lòng đăng nhập lại!");
    }
  }, []);

  console.log(isTokenValid);
  return isTokenValid; // Trả về trạng thái token để sử dụng ở component khác
};

export default useCheckRefreshTokenExp;
