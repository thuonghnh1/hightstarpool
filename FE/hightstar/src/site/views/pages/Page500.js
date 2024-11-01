import { NavLink } from "react-router-dom";

const Page500 = ({ message }) => {
  return (
    <div id="notfound" className="">
      <div className="notfound">
        <div className="notfound-404">
          <h1>
            5<span>0</span>0
          </h1>
        </div>
        <h2>Lỗi Hệ Thống</h2>
        <p>
          Xin lỗi, đã xảy ra lỗi khi cố gắng tải dữ liệu từ server. Vui lòng thử
          lại sau. <br/>
          {message}
        </p>
        <NavLink
          to={"/admin/dashboard"}
          type="button"
          className="btn btn-primary"
        >
          <span>Quay lại trang chủ</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Page500;
