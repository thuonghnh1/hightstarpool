import { NavLink } from "react-router-dom";
const HomePage = () => {
  return (
    <div>
      <h1>TRANG CHỦ</h1>
      <NavLink to={"login"} className="ms-auto">
        Login
      </NavLink>
    </div>
  );
};

export default HomePage;
