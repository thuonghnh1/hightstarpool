import React from "react";
import { NavLink } from "react-router-dom";

function Contact() {
  return (
    <div className="mb-5">
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white">Liên Hệ</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <NavLink to={"/"} className="text-decoration-none">
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Liên Hệ
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Contact Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Liên Hệ
            </h6>
            <h1 className="mb-5">Liên hệ nếu có bất kỳ câu hỏi nào</h1>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <h5>Liên Hệ</h5>
              <p className="mb-4">
                Đội ngũ chăm sóc khách hàng chuyên nghiệp của chúng tôi sẽ tư
                vấn tận tình, hỗ trợ giải đáp mọi thắc mắc của bạn.
              </p>
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: 50, height: 50 }}
                >
                  <i className="fa fa-map-marker-alt text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Trụ Sở</h5>
                  <p className="mb-0">123 Ton duc thang, lien chieu, danang</p>
                </div>
              </div>
              <div className="d-flex align-items-center mb-4">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: 50, height: 50 }}
                >
                  <i className="fa fa-phone-alt text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Số Điện Thoại</h5>
                  <p className="mb-0">+84 366675206</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0 bg-primary"
                  style={{ width: 50, height: 50 }}
                >
                  <i className="fa fa-envelope-open text-white" />
                </div>
                <div className="ms-3">
                  <h5 className="text-primary">Email</h5>
                  <p className="mb-0">hightstarpool@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <iframe
                className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.840203544254!2d108.2207426746001!3d16.073779939317212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219ee91655835%3A0xe1308fac7dc85a31!2zQsagSSBEQVQgLSAzNkEgVHLhuqduIFBow7o!5e0!3m2!1svi!2s!4v1733122233822!5m2!1svi!2s"
                style={{ minHeight: 300, border: 0 }}
                allowFullScreen=""
                aria-hidden="false"
                tabIndex={0}
                title="HighStarPool - Trung tâm bơi lội hàng đầu." // Thêm thuộc tính title
              />
            </div>
            <div className="col-lg-4 col-md-12">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                      />
                      <label htmlFor="name">Họ Và Tên</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                      />
                      <label htmlFor="email"> Email</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="Subject"
                      />
                      <label htmlFor="subject">Tiêu Đề</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Leave a message here"
                        id="message"
                        style={{ height: 100 }}
                        defaultValue={""}
                      />
                      <label htmlFor="message">Nội Dung</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      Gửi Thông Tin
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </div>
  );
}

export default Contact;
