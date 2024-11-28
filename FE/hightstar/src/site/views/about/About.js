import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function About() {
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: "Nguyễn Chí Linh",
      title: "Huấn Luyện Viên Trưởng",
      image: "assets/img/team-1.jpg",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
      },
    },
    {
      id: 2,
      name: "Huỳnh Ngọc Hoài Thương",
      title: "Huấn Luyện Viên",
      image: "assets/img/team-2.jpg",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
      },
    },
    {
      id: 3,
      name: "Nguyễn Đình Nghị",
      title: "Huấn Luyện Viên",
      image: "assets/img/team-3.jpg",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
      },
    },
    {
      id: 4,
      name: "Nguyễn Lê Thanh Huyền",
      title: "Huấn Luyện Viên",
      image: "assets/img/team-4.jpg",
      socials: {
        facebook: "#",
        twitter: "#",
        instagram: "#",
      },
    },
  ]);
  return (
    <div>
      <div className="container-fluid bg-primary py-5 mb-5 hero-header">
        <div className="container py-5">
          <div className="row justify-content-center py-5">
            <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
              <h1 className="display-3 text-white animated slideInDown">
                Về Chúng Tôi
              </h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb justify-content-center">
                  <li className="breadcrumb-item">
                    <NavLink to="/" className="text-decoration-none">
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li
                    className="breadcrumb-item text-white active"
                    aria-current="page"
                  >
                    Thông Tin
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* About Start */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-5">
            <div
              className="col-lg-6 wow fadeInUp"
              data-wow-delay="0.1s"
              style={{ minHeight: 400 }}
            >
              <div className="position-relative h-100">
                <img
                  className="img-fluid position-absolute w-100 h-100"
                  src="assets/img/about.jpg"
                  alt=""
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
              <h6 className="section-title bg-white text-start text-primary pe-3">
                Về Chúng Tôi
              </h6>
              <h1 className="mb-4">
                Chào mừng đến với{" "}
                <span className="text-primary">HightStarPool</span>
              </h1>
              <p className="mb-4">
                Chào mừng bạn đến với HightStarPool – nơi khơi nguồn niềm đam mê
                với nước và hành trình trở thành người bơi lội tự tin!
              </p>
              <p className="mb-4">
                Tại HightStarPool, chúng tôi tin rằng bơi lội không chỉ là một
                kỹ năng sống thiết yếu mà còn là cách tuyệt vời để cải thiện sức
                khỏe, thư giãn tinh thần và tận hưởng cuộc sống. Được thành lập
                bởi những huấn luyện viên bơi lội giàu kinh nghiệm và tâm huyết,
                sứ mệnh của chúng tôi là mang đến cho bạn môi trường học tập an
                toàn, hiệu quả và tràn đầy cảm hứng.
              </p>
              <div className="row gy-2 gx-4 mb-4">
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Huấn Luyện Viên Chuyên Nghiệp
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Hồ Bơi Đạt Chuẩn Quốc Tế
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Lịch học linh động
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Học bơi cam kết chất lượng
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Giáo viên 1 kèm 1 xuống hồ cùng bạn!
                  </p>
                </div>
                <div className="col-sm-6">
                  <p className="mb-0">
                    <i className="fa fa-arrow-right text-primary me-2" />
                    Hỗ Trợ 24/7
                  </p>
                </div>
              </div>
              <Link className="btn btn-primary py-3 px-5 mt-2" href="">
                Xem Thêm
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}
      {/* Team Start */}
      {/* About Section */}
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Huấn Luyện Viên
            </h6>
            <h1 className="mb-5">Đội Ngũ Huấn Luyện Viên</h1>
          </div>
          <div className="row g-4">
            {trainers.map((trainer) => (
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
                key={trainer.id}
              >
                <div className="team-item">
                  <div className="overflow-hidden">
                    <img
                      className="img-fluid"
                      src={trainer.image}
                      alt={trainer.name}
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-19px" }}
                  >
                    <Link
                      className="btn btn-square mx-1"
                      href={trainer.socials.facebook}
                    >
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link
                      className="btn btn-square mx-1"
                      href={trainer.socials.twitter}
                    >
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link
                      className="btn btn-square mx-1"
                      href={trainer.socials.instagram}
                    >
                      <i className="fab fa-instagram" />
                    </Link>
                  </div>
                  <div className="text-center p-4">
                    <h5 className="mb-0">{trainer.name}</h5>
                    <small>{trainer.title}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Team End */}
    </div>
  );
}

export default About;
