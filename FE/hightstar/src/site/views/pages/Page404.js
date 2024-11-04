import { NavLink } from "react-router-dom";

const Page404 = () => {
  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>
            4<span>0</span>4
          </h1>
        </div>
        <h2>trang bạn yêu cầu không tìm thấy</h2>
        <NavLink to={"/home"} type="button" className="btn btn-primary">
          <span>Go Back</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Page404;
