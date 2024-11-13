import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { logout } from "../../services/authService";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const HomePage = () => {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = async () => {
    logout();
    updateUser(null);
  };

  return (
    <>
      <Helmet>
        <title>Trang chủ - High Star</title>
      </Helmet>
      <div>
        <h1>TRANG CHỦ</h1>
        {user ? (
          <>
            <h1>{user.fullName}</h1>
            <Button onClick={handleLogout}>Đăng xuất</Button>{" "}
            {/* Chỉnh sửa ở đây */}
          </>
        ) : (
          <NavLink to={"/login"} className="btn btn-primary">
            Login
          </NavLink>
        )}
      </div>
    </>
  );
};

export default HomePage;
