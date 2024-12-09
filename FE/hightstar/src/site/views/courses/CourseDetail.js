import { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import { useParams, useLocation, NavLink } from "react-router-dom";
import SiteService from "../../services/SiteService";
import { Helmet } from "react-helmet-async";
import { UserContext } from "../../../contexts/UserContext";
import Reviews from "../reviews/Reviews";

const CourseDetail = () => {
  const { user, loading } = useContext(UserContext);
  const { courseId } = useParams(); // Lấy ID khóa học từ URL
  const location = useLocation(); // Lấy dữ liệu từ state (nếu có)
  const [course, setCourse] = useState(location.state?.course || null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Nếu không có course từ state, lấy dữ liệu từ API
    if (!course) {
      try {
        setLoadingPage(true);
        const data = SiteService.getCourseById(courseId);
        setCourse(data);
      } finally {
        setLoadingPage(false);
      }
    }
  }, [courseId, course, user]);

  // Hàm fetchReviews được sử dụng lại và không thay đổi trong quá trình render
  const fetchReviews = useCallback(async () => {
    try {
      setLoadingPage(true);

      const data = await SiteService.getReviewsByCourse(courseId);

      if (data && data.length > 0) {
        const totalRating = data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const avgRating = totalRating / data.length;
        setAvgRating(avgRating.toFixed(1));
      } else {
        setAvgRating(0);
      }

      setReviews(data || []);
    } finally {
      setLoadingPage(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]); // Chỉ phụ thuộc vào fetchReviews

  const renderStarRating = (rate) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rate)) {
        // Ngôi sao đầy
        stars.push(
          <i key={i} className="bi bi-star-fill text-warning me-1 fs-5" />
        );
      } else if (i === Math.ceil(rate) && rate % 1 >= 0.5) {
        // Bán ngôi sao
        stars.push(
          <i key={i} className="bi bi-star-half text-warning me-1 fs-5" />
        );
      } else {
        // Ngôi sao rỗng
        stars.push(<i key={i} className="bi bi-star text-warning me-1 fs-5" />);
      }
    }
    return stars;
  };

  return (
    <>
      {/* Những cái bên dưới truyền prop cho đúng tên của những cái m đổi rồi là đc */}
      {/* Hiển thị loader khi đang tải trang */}
      <Helmet>
        <title>Chi tiết khóa học - Hight Star</title>
      </Helmet>
      {loadingPage || loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      ) : (
        <>
          <div className="container-fluid bg-primary py-5 hero-header">
            <div className="container py-1"></div>
          </div>

          <div className="container-xxl pb-5 pt-3">
            <Container>
              <nav className="p">
                <ol className="breadcrumb justify-content-start">
                  <li className="">
                    <NavLink to="/" className="text-decoration-none">
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li className=" mx-2 text-primary">/</li>
                  <li>
                    <NavLink to="/course" className="text-decoration-none">
                      Khóa học
                    </NavLink>
                  </li>
                  <li className=" mx-2 text-primary">/</li>
                  <li className="active" aria-current="page">
                    {course.courseName}
                  </li>
                </ol>
              </nav>
              <Row>
                {/* Phần hình ảnh khóa học */}
                <Col lg={6}>
                  <Card className="border-0">
                    <Card.Img
                      variant="top"
                      src={course?.image || "/default-course.jpg"}
                      alt={course?.courseName}
                      className="rounded-1 object-fit-cover"
                      style={{ height: "300px" }}
                    />
                  </Card>
                </Col>

                {/* Thông tin chi tiết khóa học */}
                <Col
                  lg={6}
                  className="d-flex flex-column justify-content-between"
                >
                  <Card className="border-0 rounded-1 m-lg-0 mt-3">
                    <Card.Body>
                      <Card.Title className="fs-4 fw-bold">
                        {course?.courseName}
                      </Card.Title>
                      <div className="text-warning mb-3">
                        {renderStarRating(avgRating)}
                      </div>
                      <div className="mb-3">
                        <Badge bg="danger" className="me-2">
                          1 Kèm {course?.maxStudents}
                        </Badge>
                        <Badge bg="success">
                          {course?.numberOfSessions} buổi học
                        </Badge>
                      </div>
                      <div className="fw-bold text-danger fs-5 mb-3">
                        {course?.price?.toLocaleString()} VND
                      </div>
                      <Card.Text className="text-muted">
                        {course?.description ||
                          "Mô tả khóa học sẽ được cập nhật"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <div className="px-3 py-3">
                    <Button
                      variant="success"
                      className="rounded-1 me-3"
                      onClick={() => alert("Đăng ký khóa học!")}
                    >
                      <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
                    </Button>
                    <Button
                      variant="primary"
                      className="rounded-1 px-5"
                      onClick={() => alert("Đăng ký khóa học!")}
                    >
                      Đăng ký ngay
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Đánh giá và bình luận */}
              <Reviews
                reviews={reviews}
                type={"course"}
                itemId={courseId || course.id}
                setReviews={setReviews}
                userId={user?.userId || null}
              />
            </Container>
          </div>
        </>
      )}
    </>
  );
};

export default CourseDetail;
