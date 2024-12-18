import { useContext, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SiteService from "../../services/SiteService";
import { UserContext } from "../../../contexts/UserContext";
import { formatCurrency } from "../utils/formatCurrency";
import TrainerList from "./TrainerList";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import { toast } from "react-toastify";

export default function Home() {
  const { user } = useContext(UserContext);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  // State để lưu giá trị form và lỗi
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    courseId: "",
    notes: "",
  });
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [listCourseOption, setListCourseOption] = useState([]);
  const navigate = useNavigate();

  const handleNavigateDetails = (course) => {
    // Điều hướng tới URL với ID khóa học, đồng thời truyền toàn bộ đối tượng `course` qua state
    navigate(`/course/${course.id}`, {
      state: { course }, // Truyền đối tượng course qua state
    });
  };

  const fetchData = async () => {
    try {
      setLoadingPage(true);
      const listCourseData = await SiteService.getCourses();
      setCourses(listCourseData); // lưu course vào state
      const listTrainerData = await SiteService.getTrainers();
      setTrainers(listTrainerData); // Lưu course vào state
      const courseOptions = listCourseData.map((course) => ({
        value: course.id,
        label: `${course.courseName} - 1 Kèm ${course.maxStudents}`,
      }));
      setListCourseOption(courseOptions);
    } catch (error) {
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fake data for testimonials
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      location: "Hà Nội, Việt Nam",
      message:
        "Tôi rất hài lòng với dịch vụ của HightStarPool. Các huấn luyện viên rất tận tình và chuyên nghiệp.",
      image: "assets/img/testimonial-1.jpg",
    },
    {
      id: 2,
      name: "Trần Thị B",
      location: "TP. HCM, Việt Nam",
      message:
        "Cơ sở vật chất hiện đại và đội ngũ nhân viên thân thiện. Tôi sẽ tiếp tục tham gia các khóa học tại đây.",
      image: "assets/img/testimonial-2.jpg",
    },
    {
      id: 3,
      name: "Phạm Minh C",
      location: "Đà Nẵng, Việt Nam",
      message:
        "Không gian bơi rất sạch sẽ và thoải mái. Đội ngũ hướng dẫn viên rất chuyên nghiệp.",
      image: "assets/img/testimonial-3.jpg",
    },
    {
      id: 4,
      name: "Lê Thị D",
      location: "Cần Thơ, Việt Nam",
      message:
        "HightStarPool là lựa chọn hàng đầu của tôi khi tìm kiếm nơi học bơi an toàn và hiệu quả.",
      image: "assets/img/testimonial-4.jpg",
    },
  ];

  // Settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Mobile view
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.trim() === "") {
      newErrors.fullName = "Tên không được để trống.";
    } else if (/\d/.test(formData.fullName)) {
      newErrors.fullName = "Tên không được chứa chữ số.";
    }
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.courseId) {
      newErrors.courseId = "Khóa học là bắt buộc";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      courseId: "",
      notes: "",
    });
  };

  // Hàm xử lý submit
  const handleSubmitRegisterCourse = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Gọi API để gửi thông tin tư vấn.
      try {
        setLoadingPage(true);
        SiteService.sendInfoRegister(formData);
        handleResetForm();
        toast.success("Chúng tôi sẽ sớm liên hệ tư vấn cho bạn!");
      } finally {
        setLoadingPage(false);
      }
    }
  };
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
          <div className="container-fluid bg-primary py-5 mb-5 hero-header vh-100">
            <div className="container py-5">
              <div className="row justify-content-center py-5">
                <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                  <h1 className="display-3 text-white mb-3 animated slideInDown">
                    Mỗi người biết bơi.
                    <br />
                    Đánh dấu sứ mệnh hoàn thành.
                  </h1>
                  <p className="fs-4 text-white mb-4 animated slideInDown d-none d-sm-block">
                    Kỹ năng bơi lội không chỉ là môn thể thao, mà là sự bảo vệ
                    cho bản thân, gia đình và mọi người.
                  </p>
                  <div className="position-relative w-75 mx-auto animated slideInDown d-none d-sm-block">
                    <input
                      className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
                      type="text"
                      placeholder="Tìm Khóa học, huấn luyện viên..."
                    />
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill py-2 px-4 position-absolute top-0 end-0 me-2"
                      style={{ marginTop: 7 }}
                    >
                      Tìm Kiếm
                    </button>
                  </div>
                  <div className="w-75 mx-auto animated slideInDown d-sm-none mt-5">
                    <input
                      className="form-control border-0 rounded-pill w-100 py-3 ps-4 pe-5"
                      type="text"
                      placeholder="Tìm Khóa học, huấn luyện viên..."
                    />
                    <button
                      type="button"
                      className="btn btn-primary rounded-pill py-2 px-4 mt-3"
                      style={{ marginTop: 7 }}
                    >
                      Tìm Kiếm
                    </button>
                  </div>
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
                    Chào Mừng Đến Với{" "}
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
                  {user ? (
                    <NavLink
                      className="btn btn-primary py-2 px-5 mt-2"
                      to={"/course"}
                    >
                      Khám phá ngay
                    </NavLink>
                  ) : (
                    <NavLink
                      className="btn btn-primary py-2 px-5 mt-2"
                      to={"/register"}
                    >
                      Đăng ký ngay
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* About End */}
          {/* Benefit Start */}
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center wow fadeInUp">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Cam Kết Chất Lượng
                </h6>
                <h1 className="mb-5">Lợi Ích Khi Học Bơi Với Chúng Tôi</h1>
              </div>
              <div className="row g-4">
                {/* Card 1 */}
                <div className="col-lg-3 col-sm-6 wow fadeInUp">
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-swimmer fa-3x text-primary mb-3"></i>
                      <h5>Khóa Học Hiệu Quả</h5>
                      <p>
                        Hướng dẫn bơi bài bản từ cơ bản đến nâng cao, phù hợp
                        với mọi lứa tuổi.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-heartbeat fa-3x text-primary mb-3"></i>
                      <h5>Cải Thiện Sức Khỏe</h5>
                      <p>
                        Giúp tăng cường thể lực, sức bền, và giảm căng thẳng
                        hiệu quả.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.0s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-child fa-3x text-primary mb-3"></i>
                      <h5>An Toàn Hơn</h5>
                      <p>
                        Nắm vững kỹ năng bơi và cứu hộ cơ bản để tự tin hơn khi
                        tham gia bơi lội.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 4 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.7s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-users fa-3x text-primary mb-3"></i>
                      <h5>Kết Nối Cộng Đồng</h5>
                      <p>
                        Gặp gỡ bạn bè và xây dựng mối quan hệ qua các lớp học
                        nhóm.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 5 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="0.9s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-grin-beam fa-3x text-primary mb-3"></i>
                      <h5>Giảm Stress</h5>
                      <p>
                        Thư giãn tinh thần và giảm áp lực với các bài tập bơi
                        thú vị.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 6 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="1.1s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-clock fa-3x text-primary mb-3"></i>
                      <h5>Thời Gian Linh Hoạt</h5>
                      <p>
                        Lịch học đa dạng, dễ dàng sắp xếp với công việc và cuộc
                        sống.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 7 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="1.3s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-book fa-3x text-primary mb-3"></i>
                      <h5>Kiến Thức Hữu Ích</h5>
                      <p>
                        Cung cấp kiến thức cần thiết để bơi an toàn và hiệu quả
                        hơn.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Card 8 */}
                <div
                  className="col-lg-3 col-sm-6 wow fadeInUp"
                  data-wow-delay="1.5s"
                >
                  <div className="benefit-item rounded pt-3 h-100">
                    <div className="p-4 text-center">
                      <i className="fa fa-medal fa-3x text-primary mb-3"></i>
                      <h5>Đạt Thành Tích Cao</h5>
                      <p>
                        Được đào tạo chuyên sâu, giúp bạn nâng cao khả năng bơi
                        lội.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Benefit End */}
          {/* Destination Start */}
          <div className="container-xxl py-5 destination">
            <div className="container">
              <div className="text-center wow fadeInUp">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Tiện Ích
                </h6>
                <h1 className="mb-5">Một Vài Tiện Ích Của Hồ Bơi</h1>
              </div>
              <div className="row g-3">
                <div className="col-lg-7 col-md-6">
                  <div className="row g-3">
                    <div className="col-lg-12 col-md-12 wow zoomIn">
                      <Link
                        className="position-relative d-block overflow-hidden"
                        href=""
                      >
                        <img
                          className="img-fluid"
                          src="assets/img/destination-1.jpg"
                          alt=""
                        />
                        <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                          AnhHoBoi
                        </div>
                        <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                          HoBoiChinh
                        </div>
                      </Link>
                    </div>
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.3s"
                    >
                      <Link
                        className="position-relative d-block overflow-hidden"
                        href=""
                      >
                        <img
                          className="img-fluid"
                          src="assets/img/destination-2.jpg"
                          alt=""
                        />
                        <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                          AnhHoBoi
                        </div>
                        <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                          VanDongVien
                        </div>
                      </Link>
                    </div>
                    <div
                      className="col-lg-6 col-md-12 wow zoomIn"
                      data-wow-delay="0.0s"
                    >
                      <Link
                        className="position-relative d-block overflow-hidden"
                        href=""
                      >
                        <img
                          className="img-fluid"
                          src="assets/img/destination-3.jpg"
                          alt=""
                        />
                        <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                          AnhHoBoi
                        </div>
                        <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                          VanDongVien
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-5 col-md-6 wow zoomIn"
                  data-wow-delay="0.7s"
                  style={{ minHeight: 350 }}
                >
                  <Link
                    className="position-relative d-block h-100 overflow-hidden"
                    href=""
                  >
                    <img
                      className="img-fluid position-absolute w-100 h-100"
                      src="assets/img/destination-4.jpg"
                      alt=""
                      style={{ objectFit: "cover" }}
                    />
                    <div className="bg-white text-danger fw-bold position-absolute top-0 start-0 m-3 py-1 px-2">
                      AnhHoBoi
                    </div>
                    <div className="bg-white text-primary fw-bold position-absolute bottom-0 end-0 m-3 py-1 px-2">
                      HoThiDau
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Destination Start */}
          {/* Course Start */}
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Khóa Học
                </h6>
                <h1 className="mb-5">Khám Phá Các Khóa Học Bơi</h1>
              </div>
              <div className="row g-4 justify-content-center">
                {courses &&
                  courses.slice(0, 3).map((course) => (
                    <div className="col-lg-4 col-md-6" key={course.id}>
                      <div className="course-item rounded overflow-hidden shadow">
                        <div
                          className="overflow-hidden"
                          style={{
                            height: "250px",
                            width: "100%",
                          }}
                        >
                          <img
                            className="img-fluid w-100 h-100"
                            src={course.image}
                            alt={course.courseName}
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="d-flex border-bottom">
                          <small className="flex-fill text-center border-end py-2 m-auto">
                            1 Kèm {course.maxStudents}
                          </small>
                          <small className="flex-fill text-center border-end py-2 m-auto">
                            {course.numberOfSessions} Buổi
                          </small>
                          <small className="flex-fill text-center py-2 m-auto">
                            {formatCurrency(course.price)}
                          </small>
                        </div>
                        <div className="text-center p-4">
                          <h5 className="mb-3 fw-bold text-truncate">
                            {course.courseName}
                          </h5>
                          <p className="mb-3 text text-truncate">
                            {course.description}
                          </p>
                          <div className="d-flex justify-content-center mb-2">
                            <div
                              className="btn btn-sm btn-primary px-3 border-end"
                              style={{ borderRadius: "30px 0 0 30px" }}
                              onClick={() => handleNavigateDetails(course)}
                            >
                              Xem chi tiết
                            </div>
                            <div
                              className="btn btn-sm btn-primary px-3"
                              style={{ borderRadius: "0 30px 30px 0" }}
                              onClick={() => handleNavigateDetails(course)}
                            >
                              Đăng Ký Ngay
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="d-flex justify-content-center">
                <NavLink
                  className="btn-link link-primary border-0 bg-transparent py-2 mt-5"
                  to={"/course"}
                >
                  Xem nhiều hơn
                </NavLink>{" "}
              </div>
            </div>
          </div>
          {/* Course End */}
          {/* Booking Start */}
          <div className="container-xxl py-5 text-light">
            <div className="container">
              <div
                className="booking p-5"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  borderRadius: "5px",
                }}
              >
                <div className="row g-5 align-items-center">
                  {/* Left Section */}
                  <div className="col-md-6">
                    <h6 className="text-uppercase text-light">Đăng Ký</h6>
                    <h1 className="mb-4 text-light">
                      Đăng Ký Ngay – Đừng Chần Chừ!
                    </h1>
                    <p className="mb-4">
                      Chúng tôi hiểu rằng mỗi người có nhu cầu và mục tiêu học
                      bơi khác nhau. Vì vậy, đội ngũ tư vấn chuyên nghiệp của
                      HightStarPool luôn sẵn sàng hỗ trợ bạn bất cứ khi nào!
                    </p>
                    <p className="mb-4">
                      Hãy để chúng tôi giúp bạn chọn ra khóa học phù hợp nhất
                      với trình độ, lịch trình, và mong muốn cá nhân. Dù bạn là
                      người chưa từng xuống nước, đang muốn cải thiện kỹ năng
                      bơi lội, hay mong muốn con mình phát triển toàn diện với
                      bơi lội – chúng tôi đều có giải pháp hoàn hảo dành cho
                      bạn.
                    </p>
                    <Link
                      className="btn btn-outline-light py-3 px-5 mt-2 rounded-1"
                      href=""
                    >
                      Đọc Thêm
                    </Link>
                  </div>

                  {/* Right Section */}
                  <div className="col-md-6">
                    <h1 className="text-white mb-4">Điền Thông Tin Liên Hệ</h1>
                    <form onSubmit={handleSubmitRegisterCourse}>
                      <div className="row g-3">
                        {/* Tên */}
                        <div className="col-12">
                          <input
                            type="text"
                            className="form-control rounded-1 py-3"
                            placeholder="Tên Của Bạn"
                            value={formData.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.0)",
                              color: "#fff",
                              border: "1px solid rgba(255, 255, 255, 0.6)",
                            }}
                          />
                          {errorFields.fullName && (
                            <div className="invalid-feedback d-block">
                              {errorFields.fullName}
                            </div>
                          )}
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                          <input
                            type="email"
                            className="form-control rounded-1 py-3"
                            placeholder="Email Của Bạn"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.0)",
                              color: "#fff",
                              border: "1px solid rgba(255, 255, 255, 0.6)",
                            }}
                          />
                          {errorFields.email && (
                            <div className="invalid-feedback d-block">
                              {errorFields.email}
                            </div>
                          )}
                        </div>

                        {/* Số Điện Thoại */}
                        <div className="col-md-6">
                          <input
                            type="tel"
                            className="form-control rounded-1 py-3"
                            placeholder="Số Điện Thoại"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                              handleInputChange("phoneNumber", e.target.value)
                            }
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.0)",
                              color: "#fff",
                              border: "1px solid rgba(255, 255, 255, 0.6)",
                            }}
                          />
                          {errorFields.phoneNumber && (
                            <div className="invalid-feedback d-block">
                              {errorFields.phoneNumber}
                            </div>
                          )}
                        </div>

                        {/* Select Khóa Học */}
                        <div className="col-12">
                          <Select
                            options={listCourseOption}
                            value={listCourseOption.find(
                              (option) => option.value === formData.courseId
                            )}
                            onChange={(selectedOption) =>
                              handleInputChange(
                                "courseId",
                                selectedOption ? selectedOption.value : ""
                              )
                            }
                            placeholder="Chọn khóa học"
                            isInvalid={!!errorFields.courseId}
                            isClearable
                            isSearchable
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                backgroundColor: "rgba(255, 255, 255, 0.0)", // Nền trong suốt hơn
                                border: "1px solid rgba(255, 255, 255, 0.6)", // Viền mờ
                                borderRadius: "4px", // Làm tròn viền
                                padding: "10px 0", // Padding cho input
                                color: "#fff",
                              }),
                              menu: (provided) => ({
                                ...provided,
                                color: "black",
                              }),
                              placeholder: (provided) => ({
                                ...provided,
                                color: "rgba(255, 255, 255, 0.6)",
                              }),
                              singleValue: (provided) => ({
                                ...provided,
                                color: "#fff", // Màu chữ đã chọn
                              }),
                              input: (provided) => ({
                                ...provided,
                                color: "#fff", // Màu chữ khi gõ
                              }),
                            }}
                          />
                          {errorFields.courseId && (
                            <div className="invalid-feedback d-block">
                              {errorFields.courseId}
                            </div>
                          )}
                        </div>

                        {/* Ghi Chú */}
                        <div className="col-12">
                          <textarea
                            className="form-control rounded-1"
                            placeholder="Ghi Chú"
                            value={formData.notes}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            style={{
                              height: 100,
                              backgroundColor: "rgba(255, 255, 255, 0.0)",
                              color: "#fff",
                              border: "1px solid rgba(255, 255, 255, 0.6)",
                            }}
                          />
                        </div>

                        {/* Nút Submit */}
                        <div className="col-12">
                          <button
                            className="btn btn-outline-light w-100 py-3 rounded-1"
                            type="submit"
                          >
                            Đăng Ký Ngay
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Booking End */}
          {/* Process Start */}
          <div className="container-xxl py-5">
            <div className="container">
              <div className="text-center pb-4 wow fadeInUp">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  Xử Lý Đơn Hàng
                </h6>
                <h1 className="mb-5">3 Bước Đơn Giản</h1>
              </div>
              <div className="row gy-5 gx-4 justify-content-center align-items-stretch">
                {/* Box 1 */}
                <div className="col-lg-4 col-sm-6">
                  <div
                    className="h-100 border border-primary rounded shadow-sm text-center p-4 position-relative step-item"
                    style={{
                      backgroundColor: "#f9f9f9",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 start-50 translate-middle"
                      style={{ width: 80, height: 80 }}
                    >
                      <i className="bi bi-person-lines-fill fs-3"></i>
                    </div>
                    {/* Content */}
                    <h5 className="mt-5">Bước 1: Đăng ký và tư vấn miễn phí</h5>
                    <hr className="w-25 mx-auto bg-primary mb-1" />
                    <hr className="w-50 mx-auto bg-primary mt-0" />
                    <p className="mb-0">
                      Liên hệ với chúng tôi qua hotline, email, hoặc nhắn tin
                      trên mạng xã hội. Chia sẻ nhu cầu của bạn (trình độ hiện
                      tại, mục tiêu học bơi, lịch trình phù hợp). Đội ngũ tư vấn
                      chuyên nghiệp sẽ gợi ý khóa học phù hợp nhất và giải đáp
                      mọi thắc mắc của bạn.
                    </p>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="col-lg-4 col-sm-6" data-wow-delay="0.3s">
                  <div
                    className="h-100 border border-primary rounded shadow-sm text-center p-4 position-relative step-item"
                    style={{
                      backgroundColor: "#f9f9f9",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 start-50 translate-middle"
                      style={{ width: 80, height: 80 }}
                    >
                      <i className="bi bi-credit-card-fill fs-3"></i>
                    </div>
                    {/* Content */}
                    <h5 className="mt-5">Bước 2: Xác nhận và thanh toán</h5>
                    <hr className="w-25 mx-auto bg-primary mb-1" />
                    <hr className="w-50 mx-auto bg-primary mt-0" />
                    <p className="mb-0">
                      Sau khi chọn được khóa học ưng ý, bạn sẽ nhận được thông
                      tin chi tiết về lịch học, huấn luyện viên, và mức phí.
                      Thanh toán đơn giản qua các hình thức: Chuyển khoản ngân
                      hàng. Thanh toán trực tiếp tại trung tâm. Thanh toán qua
                      ví điện tử (nếu có). Nhận hóa đơn và xác nhận đăng ký qua
                      email hoặc tin nhắn.
                    </p>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="col-lg-4 col-sm-6" data-wow-delay="0.0s">
                  <div
                    className="h-100 border border-primary rounded shadow-sm text-center p-4 position-relative step-item"
                    style={{
                      backgroundColor: "#f9f9f9",
                      transition: "transform 0.3s, box-shadow 0.3s",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 start-50 translate-middle"
                      style={{ width: 80, height: 80 }}
                    >
                      <i className="bi bi-clipboard-check-fill fs-3"></i>
                    </div>
                    {/* Content */}
                    <h5 className="mt-5">Bước 3: Bắt đầu hành trình học bơi</h5>
                    <hr className="w-25 mx-auto bg-primary mb-1" />
                    <hr className="w-50 mx-auto bg-primary mt-0" />
                    <p className="mb-0">
                      Tham gia buổi học đầu tiên theo lịch đã chọn. Gặp gỡ huấn
                      luyện viên và làm quen với môi trường học an toàn, chuyên
                      nghiệp. Chúng tôi sẽ đồng hành cùng bạn trong suốt quá
                      trình học, đảm bảo bạn đạt được kết quả tốt nhất.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Process End */}
          {/* Team Start */}
          {trainers && (
            <TrainerList
              trainers={trainers}
              setTrainers={setTrainers}
              user={user}
              setLoadingPage={setLoadingPage}
              trainersPerPage={4}
            />
          )}
          {/* Team End */}
          {/* Review */}
          <div className="container-xxl py-5 mb-5">
            <div className="container">
              <div className="text-center">
                <h6 className="section-title bg-white text-center text-primary px-3">
                  HightStarPool
                </h6>
                <h1 className="mb-5">Học viên đã nói gì về HightStarPool?</h1>
              </div>
              <Slider {...settings} className="testimonial-carousel">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="testimonial-item bg-white text-center  p-4"
                  >
                    <img
                      className="bg-white rounded-circle shadow p-1 mx-auto mb-3"
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{ width: 80, height: 80 }}
                    />
                    <h5 className="mb-0">{testimonial.name}</h5>
                    <p>{testimonial.location}</p>
                    <p className="mt-2 mb-0">{testimonial.message}</p>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          {/* Review */}
        </div>
      )}
    </>
  );
}
