import { Link, NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <div>
      {/* Footer Start */}
      <div
        className="container-fluid bg-dark text-light footer pt-5 mt-5"
      >
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-start">
              <h4 className="text-white mb-3">Công Ty HightStarPool</h4>
              <NavLink className="btn btn-link" to="/">
                Thông Tin
              </NavLink>
              <NavLink className="btn btn-link" to="/">
                Liên Hệ
              </NavLink>
              <NavLink className="btn btn-link" to="/">
                Chính sách bảo mật
              </NavLink>
              <NavLink className="btn btn-link" to="/">
                Điều Khoản &amp; Dịch Vụ
              </NavLink>
              <NavLink className="btn btn-link" to="/">
                Hỏi Đáp &amp; Trợ Giúp
              </NavLink>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Liên Hệ</h4>
              <p className="mb-2">
                <i className="fa fa-map-marker-alt me-3" />
                123 Ton Duc Thang, Lien Chieu, DaNang.
              </p>
              <p className="mb-2">
                <i className="fa fa-phone-alt me-3" />
                +012 345 67890
              </p>
              <p className="mb-2">
                <i className="fa fa-envelope me-3" />
                HightStarPool@gmail.com
              </p>
              <div className="d-flex pt-2">
                <Link className="btn btn-outline-light btn-social" to="/">
                  <i className="fab fa-twitter" />
                </Link>
                <Link className="btn btn-outline-light btn-social" to="/">
                  <i className="fab fa-facebook-f" />
                </Link>
                <Link className="btn btn-outline-light btn-social" to="">
                  <i className="fab fa-youtube" />
                </Link>
                <Link className="btn btn-outline-light btn-social" to="">
                  <i className="fab fa-linkedin-in" />
                </Link>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Ảnh</h4>
              <div className="row g-2 pt-2">
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/course-1.jpg"
                    alt="1"
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/course-2.jpg"
                    alt="2"
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/course-3.jpg"
                    alt="3"
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/bg-hero.jpg"
                    alt="4"
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/about.jpg"
                    alt="5"
                  />
                </div>
                <div className="col-4">
                  <img
                    className="img-fluid object-fit-cover bg-light p-1"
                    style={{height:"70px"}}
                    src="/assets/img/course-2.jpg"
                    alt="6"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h4 className="text-white mb-3">Nhận Thông Tin Mới Nhất</h4>
              <p>Điền mail để nhận các ưu đãi của chúng tôi</p>
              <div
                className="position-relative mx-auto"
                style={{ maxWidth: 400 }}
              >
                <input
                  className="form-control border-primary w-100 py-3 ps-4 pe-5"
                  type="text"
                  placeholder="Mail Của Bạn"
                />
                <button
                  type="button"
                  className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2"
                >
                  Đăng Ký
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                ©{" "}
                <NavLink className="border-bottom" to="#">
                  HightStarPool
                </NavLink>
                , Bản Quyền Thuộc Sở Hữu Bởi{" "}
                <NavLink
                  className="border-bottom"
                  to="https://github.com/thuonghnh1/hightstarpool"
                >
                  HightStarPoolCompany
                </NavLink>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <NavLink to="/">Trang chủ</NavLink>
                  <NavLink to="/">Cookies</NavLink>
                  <NavLink to="/">Trợ Giúp</NavLink>
                  <NavLink to="/">Hỏi Đáp</NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
    </div>
  );
}
