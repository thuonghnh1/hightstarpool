import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, NavLink } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";
import { Spinner } from "react-bootstrap";
import TrainerList from "../homes/TrainerList";
import SiteService from "../../services/SiteService";

function About() {
  const { user } = useContext(UserContext);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [trainers, setTrainers] = useState([]);

  const fetchData = async () => {
    try {
      setLoadingPage(true);
      const listTrainerData = await SiteService.getTrainers();
      setTrainers(listTrainerData); // Lưu course vào state
    } catch (error) {
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Trang chủ - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      ) : (
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
                <div className="col-lg-6" style={{ minHeight: 400 }}>
                  <div className="position-relative h-100">
                    <img
                      className="img-fluid position-absolute w-100 h-100"
                      src="assets/img/about.jpg"
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <h6 className="section-title bg-white text-start text-primary pe-3">
                    Về Chúng Tôi
                  </h6>
                  <h1 className="mb-4">
                    Chào mừng đến với{" "}
                    <span className="text-primary">HightStarPool</span>
                  </h1>
                  <p className="mb-4">
                    Chào mừng bạn đến với HightStarPool – nơi khơi nguồn niềm
                    đam mê với nước và hành trình trở thành người bơi lội tự
                    tin!
                  </p>
                  <p className="mb-4">
                    Tại HightStarPool, chúng tôi tin rằng bơi lội không chỉ là
                    một kỹ năng sống thiết yếu mà còn là cách tuyệt vời để cải
                    thiện sức khỏe, thư giãn tinh thần và tận hưởng cuộc sống.
                    Được thành lập bởi những huấn luyện viên bơi lội giàu kinh
                    nghiệm và tâm huyết, sứ mệnh của chúng tôi là mang đến cho
                    bạn môi trường học tập an toàn, hiệu quả và tràn đầy cảm
                    hứng.
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
          {/* Trainer team */}
          {trainers && (
            <TrainerList
              trainers={trainers}
              setTrainers={setTrainers}
              user={user}
              setLoadingPage={setLoadingPage}
              trainersPerPage={8}
            />
          )}
          {/* End trainer team*/}
        </div>
      )}
    </>
  );
}

export default About;
