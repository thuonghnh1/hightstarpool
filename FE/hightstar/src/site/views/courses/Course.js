import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import SiteService from "../../services/SiteService";
import CourseList from "./CourseList";

function Course() {
  const [loadingPage, setLoadingPage] = useState(false); // this for page loading indicator
  const [courses, setCourses] = useState([]);

  const fetchData = async () => {
    try {
      setLoadingPage(true);
      const listCourseData = await SiteService.getCourses(); // Gọi service để lấy danh sách khóa học
      setCourses(listCourseData); // Lưu danh sách khóa học vào state
    } catch (error) {
      console.error(error);
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
        <title>Khóa Học - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div>
          {/* Hero Header */}
          <div className="container-fluid bg-primary mb-sm-5 hero-header">
            <div className="container py-5">
              <div className="row justify-content-center py-5">
                <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                  <h1 className="display-3 text-white animated slideInDown">
                    Khóa Học Của Chúng Tôi
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
                        Khóa Học
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info Start */}
          <div className="container-xxl py-4 mt-1 py-sm-5">
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
                      src="assets/img/banner-course.jpg"
                      alt="Khóa học"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>

                <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.3s">
                  <h6 className="section-title bg-white text-start text-primary pe-3">
                    Khóa Học Của Chúng Tôi
                  </h6>
                  <h1 className="mb-4">Khám Phá Các Khóa Học Đầy Thú Vị</h1>
                  <p className="mb-4">
                    HightStarPool mang đến cho bạn những khóa học bơi lội đa
                    dạng và chất lượng. Mỗi khóa học được thiết kế phù hợp với
                    mọi lứa tuổi và trình độ, giúp bạn đạt được những kỹ năng
                    bơi lội cần thiết một cách nhanh chóng và hiệu quả.
                  </p>
                  <p className="mb-4">
                    Hãy lựa chọn khóa học phù hợp với mục tiêu của bạn và gia
                    nhập cùng chúng tôi!
                  </p>

                  {/* Box thêm thông tin và icon */}
                  <div className="border p-4 rounded shadow mt-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-swimmer fa-2x text-primary me-3"></i>
                      <h5 className="mb-0">
                        Khóa Học Được Giảng Dạy Bởi HLV Chuyên Nghiệp
                      </h5>
                    </div>
                    <p>
                      Với đội ngũ huấn luyện viên chuyên nghiệp, chúng tôi cam
                      kết mang đến cho bạn những giờ học bơi thú vị, năng động
                      và hiệu quả.
                    </p>
                  </div>

                  {/* Box thêm thông tin và icon khác */}
                  <div className="border p-4 rounded shadow mt-4">
                    <div className="d-flex align-items-center mb-3">
                      <i className="fas fa-calendar-alt fa-2x text-primary me-3"></i>
                      <h5 className="mb-0">Lịch Học Linh Hoạt</h5>
                    </div>
                    <p>
                      Lịch học được sắp xếp linh hoạt, phù hợp với mọi đối tượng
                      học viên. Bạn có thể chọn thời gian học sao cho tiện lợi
                      nhất với lịch trình của mình.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Info End */}
          {/* Course List */}
          {courses && <CourseList courses={courses} coursesPerPage={3} />}
          {/* Course List End */}
        </div>
      )}
    </>
  );
}

export default Course;
