import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TableManagement from "../../components/common/TableManagement";
import ReviewService from "../../services/ReviewService";
import Page500 from "../../../common/pages/Page500";
import { Spinner, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";

const ReviewManagement = () => {
  // State để lưu trữ dữ liệu review từ API
  const [reviewData, setReviewData] = useState([]);
  const [formData, setFormData] = useState({}); // State quản lý dữ liệu hiện tại
  const [errorFields, setErrorFields] = useState({}); // State quản lý lỗi
  const [statusFunction, setStatusFunction] = useState({
    isAdd: false,
    isEditing: false,
    isViewDetail: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
  const [errorServer, setErrorServer] = useState(null);

  // Mảng cột của bảng
  const reviewColumns = [
    { key: "id", label: "ID" },
    { key: "rating", label: "Đánh giá" },
    { key: "comment", label: "Nhận xét" },
    { key: "images", label: "Hình ảnh" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "productId", label: "Mã sản phẩm" },
    { key: "courseId", label: "Mã khóa học" },
    { key: "trainerId", label: "Mã HLV" },
    { key: "userId", label: "Mã người dùng" },
  ];

  // Loại bỏ một số cột không cần thiết khỏi reviewColumns
  const keysToRemove = ["createdAt", "comment"];
  const defaultColumns = reviewColumns.filter(
    (column) => !keysToRemove.includes(column.key)
  );

  // Gọi API để lấy dữ liệu từ server
  const fetchReviewData = async () => {
    setLoadingPage(true);
    try {
      const data = await ReviewService.getReviews();
      setReviewData(data); // Lưu dữ liệu vào state
    } catch (err) {
      setErrorServer(err.message); // Lưu lỗi vào state nếu có
    } finally {
      setLoadingPage(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchReviewData();
  }, []);

  // Hàm validate cho từng trường input
  const validateField = (key, value) => {
    let error = "";

    switch (key) {
      case "rating":
        if (!value || isNaN(value) || value < 1 || value > 5) {
          error = "Đánh giá phải là một số từ 1 đến 5.";
        }
        break;

      case "comment":
        if (!value || value.trim() === "") {
          error = "Nhận xét không được để trống.";
        }
        break;

      default:
        break;
    }

    setErrorFields((prevErrors) => ({
      ...prevErrors,
      [key]: error,
    }));
  };

  // Hàm validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};

    if (
      !formData.rating ||
      isNaN(formData.rating) ||
      formData.rating < 1 ||
      formData.rating > 5
    ) {
      newErrors.rating = "Đánh giá phải là một số từ 1 đến 5.";
    }

    if (!formData.comment || formData.comment.trim() === "") {
      newErrors.comment = "Nhận xét không được để trống.";
    }
    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
    validateField(key, value);
  };

  const updateStatus = (newStatus) => {
    setStatusFunction((prevStatus) => ({
      ...prevStatus, // Giữ lại các thuộc tính trước đó
      ...newStatus, // Cập nhật các thuộc tính mới
    }));
  };

  const handleResetStatus = () => {
    updateStatus({ isAdd: true, isEditing: false, isViewDetail: false });
  };

  // Hàm reset form khi thêm mới
  const handleReset = () => {
    setFormData({
      rating: 1,
      comment: "",
      images: "",
    });
    handleResetStatus();
    setErrorFields({});
  };

  // Hàm gọi khi nhấn "Sửa" một hàng
  const handleEdit = (item) => {
    setFormData({
      ...item,
    });
    updateStatus({ isEditing: true });
    setErrorFields({});
  };

  const handleSaveItem = async () => {
    if (!validateForm()) return false;

    setIsLoading(true);

    try {
      if (statusFunction.isEditing) {
        // Gọi API cập nhật sử dụng ReviewService
        const updatedReview = await ReviewService.updateReview(
          formData.reviewId,
          formData
        );

        // Cập nhật state reviewData với review đã được sửa
        const updatedReviews = reviewData.map((review) =>
          review.reviewId === updatedReview.reviewId ? updatedReview : review
        );

        setReviewData(updatedReviews);
        toast.success("Cập nhật thành công!");
      } else if (statusFunction.isAdd) {
        // Nếu đang ở trạng thái thêm mới
        const newReview = await ReviewService.createReview(formData);

        // Cập nhật mảng reviewData với item vừa được thêm
        setReviewData([...reviewData, newReview]);

        toast.success("Thêm mới thành công!");
      }

      handleReset();
      return true;
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data + "!"); // Hiển thị thông điệp lỗi từ server
      } else {
        toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!"); // Thông báo lỗi chung
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa một review
  const handleDelete = (deleteId) => {
    if (deleteId) {
      setIsLoading(true);
      ReviewService.deleteReview(deleteId)
        .then(() => {
          setReviewData(
            reviewData.filter((review) => review.reviewId !== deleteId)
          );
          toast.success("Xóa thành công!");
        })
        .catch(() => {
          toast.error("Đã xảy ra lỗi khi xóa.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const modalContent = (
    <>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Group controlId="formRating">
            <Form.Label>
              Đánh giá <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="rating"
              min={1}
              max={5}
              value={formData.rating}
              onChange={(e) => handleInputChange("rating", e.target.value)}
              isInvalid={!!errorFields.rating}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.rating}
            </Form.Control.Feedback>
          </Form.Group>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Group controlId="formImages">
            <Form.Label>Hình ảnh</Form.Label>
            <Form.Control
              type="text"
              name="images"
              value={formData.images}
              onChange={(e) => handleInputChange("images", e.target.value)}
              placeholder="URL hình ảnh"
            />
          </Form.Group>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <Form.Group controlId="formComment">
            <Form.Label>
              Nhận xét <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comment"
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              isInvalid={!!errorFields.comment}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.comment}
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Helmet>
        <title>Quản lý đánh giá - Hight Star</title>
      </Helmet>
      {/* Hiển thị loader khi đang tải trang */}
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" className="text-primary" />
        </div>
      ) : errorServer ? (
        <Page500 message={errorServer} />
      ) : (
        <section className="row m-0 p-0 ">
          <TableManagement
            columns={reviewColumns}
            data={reviewData}
            title={"Quản lý đánh giá"}
            defaultColumns={defaultColumns} // Truyền mảng cột đã lọc
            modalContent={modalContent}
            handleReset={handleReset}
            onEdit={handleEdit}
            handleSaveItem={handleSaveItem}
            onDelete={handleDelete}
            isLoading={isLoading}
            statusFunction={statusFunction}
            onResetStatus={handleResetStatus}
          />
        </section>
      )}
    </>
  );
};

export default ReviewManagement;
