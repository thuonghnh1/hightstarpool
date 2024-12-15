import { useState, useEffect, useContext, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { useParams, useLocation, NavLink, useNavigate } from "react-router-dom";
import SiteService from "../../services/SiteService";
import { Helmet } from "react-helmet-async";
import { UserContext } from "../../../contexts/UserContext";
import Reviews from "../reviews/Reviews";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

const CourseDetail = () => {
  const { user, loading } = useContext(UserContext);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(location.state?.course || null);
  const [loadingPage, setLoadingPage] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    courseId: "",
    notes: "",
  });
  const [errorFields, setErrorFields] = useState({});
  const [listCourseOption, setListCourseOption] = useState([]);

  useEffect(() => {
    if (!course) {
      const fetchCourse = async () => {
        try {
          setLoadingPage(true);
          const data = await SiteService.getCourseById(courseId);
          setCourse(data);
        } catch (error) {
          console.error("Error fetching course:", error);
        } finally {
          setLoadingPage(false);
        }
      };
      fetchCourse();
    }
  }, [courseId, course, user]);

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
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingPage(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const renderStarRating = (rate) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rate)) {
        stars.push(
          <i key={i} className="bi bi-star-fill text-warning me-1 fs-5" />
        );
      } else if (i === Math.ceil(rate) && rate % 1 >= 0.5) {
        stars.push(
          <i key={i} className="bi bi-star-half text-warning me-1 fs-5" />
        );
      } else {
        stars.push(<i key={i} className="bi bi-star text-warning me-1 fs-5" />);
      }
    }
    return stars;
  };

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

  const handleSubmitRegisterCourse = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        // setLoadingPage(true);
        await SiteService.sendInfoRegister(formData);
        handleResetForm();
        toast.success("Chúng tôi sẽ sớm liên hệ tư vấn cho bạn!");
        handleClose();
      } catch (error) {
        toast.error("Đăng ký thất bại. Vui lòng thử lại!");
      } finally {
        setLoadingPage(false);
      }
    }
  };

  const handleNavigateDetails = (course) => {
    navigate(`/course/${course.id}`, {
      state: { course },
    });
  };

  useEffect(() => {
    const fetchCourseOptions = async () => {
      try {
        const listCourseData = await SiteService.getCourses();
        const courseOptions = listCourseData.map((course) => ({
          value: course.id,
          label: `${course.courseName} - 1 Kèm ${course.maxStudents}`,
        }));
        setListCourseOption(courseOptions);
      } catch (error) {
        console.error("Error fetching course options:", error);
      }
    };
    fetchCourseOptions();
  }, []);

  return (
    <>
      <Helmet>
        <title>Chi tiết khóa học - Hight Star</title>
      </Helmet>
      <ToastContainer />
      {loadingPage || loading ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="container-fluid bg-primary py-5 hero-header">
            <div className="container py-1"></div>
          </div>

          <div className="container-xxl pb-5 pt-3">
            <Container>
              <nav>
                <ol className="breadcrumb justify-content-start">
                  <li className="">
                    <NavLink to="/" className="text-decoration-none">
                      Trang Chủ
                    </NavLink>
                  </li>
                  <li className="mx-2 text-primary">/</li>
                  <li>
                    <NavLink to="/course" className="text-decoration-none">
                      Khóa học
                    </NavLink>
                  </li>
                  <li className="mx-2 text-primary">/</li>
                  <li className="active" aria-current="page">
                    {course.courseName}
                  </li>
                </ol>
              </nav>
              <Row>
                {/* Hình ảnh khóa học */}
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
                    {/* <Button
                      variant="success"
                      className="rounded-1 me-3"
                      onClick={() => alert("Đăng ký khóa học!")}
                    >
                      <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ hàng
                    </Button> */}
                    <Button
                      variant="primary"
                      className="rounded-1 px-5"
                      onClick={handleShow} // Mở modal thay vì alert
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

          {/* Modal Đăng Ký */}
          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Đăng Ký Khóa Học</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleSubmitRegisterCourse}>
                <div className="row g-3">
                  {/* Tên */}
                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control rounded-1 py-3 ${
                        errorFields.fullName ? "is-invalid" : ""
                      }`}
                      placeholder="Tên Của Bạn"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      style={{
                        backgroundColor: "#f8f9fa",
                        color: "#495057",
                      }}
                    />
                    {errorFields.fullName && (
                      <div className="invalid-feedback">
                        {errorFields.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <input
                      type="email"
                      className={`form-control rounded-1 py-3 ${
                        errorFields.email ? "is-invalid" : ""
                      }`}
                      placeholder="Email Của Bạn"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      style={{
                        backgroundColor: "#f8f9fa",
                        color: "#495057",
                      }}
                    />
                    {errorFields.email && (
                      <div className="invalid-feedback">
                        {errorFields.email}
                      </div>
                    )}
                  </div>

                  {/* Số Điện Thoại */}
                  <div className="col-md-6">
                    <input
                      type="tel"
                      className={`form-control rounded-1 py-3 ${
                        errorFields.phoneNumber ? "is-invalid" : ""
                      }`}
                      placeholder="Số Điện Thoại"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      style={{
                        backgroundColor: "#f8f9fa",
                        color: "#495057",
                      }}
                    />
                    {errorFields.phoneNumber && (
                      <div className="invalid-feedback">
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
                      isClearable
                      isSearchable
                      className={errorFields.courseId ? "is-invalid" : ""}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          backgroundColor: "#f8f9fa",
                          borderColor: state.isFocused
                            ? "#86b7fe"
                            : errorFields.courseId
                            ? "#dc3545"
                            : provided.borderColor,
                          boxShadow: state.isFocused
                            ? "0 0 0 0.25rem rgba(13,110,253,.25)"
                            : provided.boxShadow,
                          "&:hover": {
                            borderColor: state.isFocused
                              ? "#86b7fe"
                              : errorFields.courseId
                              ? "#dc3545"
                              : provided.borderColor,
                          },
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999, // Đảm bảo menu hiển thị trên modal
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: "#6c757d",
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "#495057",
                        }),
                        input: (provided) => ({
                          ...provided,
                          color: "#495057",
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
                        backgroundColor: "#f8f9fa",
                        color: "#495057",
                      }}
                    />
                  </div>

                  {/* Nút Submit */}
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3 rounded-1"
                      type="submit"
                    >
                      Đăng Ký Ngay
                    </button>
                  </div>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default CourseDetail;
