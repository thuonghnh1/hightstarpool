import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Form,
  Image,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import SiteService from "../../services/SiteService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Reviews = ({ reviews, setReviews, type, itemId, userId }) => {
  const [formData, setFormData] = useState({
    reviewId: "",
    itemId: itemId,
    comment: "",
    rating: 0,
    images: [], // Lưu trữ danh sách file
    userId: userId || null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    // Kiểm tra xem có review nào của user hiện tại không
    const userReview = reviews.find((review) => review.userId === userId);

    if (userReview) {
      setFormData((prev) => ({
        ...prev,
        reviewId: userReview.reviewId, // Gán ID để cập nhật
        comment: userReview.comment, // Gán nội dung bình luận cũ
        rating: userReview.rating, // Gán điểm đánh giá cũ
        images: [], // Để trống (nếu có logic thêm ảnh mới)
        previewImages: [], // Không hiển thị ảnh cũ (nếu có)
      }));
    }
  }, [reviews, userId]);

  // Cleanup các URL tạm khi component bị unmount hoặc form reset
  useEffect(() => {
    return () => {
      formData.previewImages?.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.previewImages]);

  const handleCommentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      comment: e.target.value,
    }));
  };

  const handleRatingChange = (rate) => {
    setFormData((prev) => ({
      ...prev,
      rating: rate,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3); // Chỉ lấy tối đa 3 file
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: files,
      previewImages: previewUrls, // Lưu URL xem trước
    }));
  };

  const handleImageClick = (img) => {
    setCurrentImage(img);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCommentSubmit = async () => {
    if (!userId) {
      toast.warning("Vui lòng đăng nhập để có thể đánh giá!");
      navigate("/login");
      return;
    }

    if (!formData.comment.trim()) {
      toast.warning("Vui lòng nhập bình luận!");
      setErrorMessage("Vui lòng nhập bình luận!");
      return;
    }

    // Chuẩn bị dữ liệu động theo `type`
    const reviewData = {
      [`${type}Id`]: formData.itemId,
      comment: formData.comment,
      rating: formData.rating,
      userId: formData.userId,
      ...(formData.reviewId && { reviewId: formData.reviewId }), // Chỉ gửi `reviewId` nếu đã có
    };

    const files = formData.images || []; // Lấy danh sách hình ảnh (nếu có)

    setLoading(true);
    try {
      const data = await SiteService.addOrUpdate(reviewData, files); // Gửi dữ liệu theo định dạng service yêu cầu

      // Kiểm tra xem review đã tồn tại trong danh sách hay chưa
      const existingReviewIndex = reviews.findIndex(
        (review) => review.reviewId === data.reviewId
      );

      let updatedReviews;
      if (existingReviewIndex !== -1) {
        // Nếu tồn tại, cập nhật dữ liệu mới vào review cũ
        updatedReviews = reviews.map((review, index) =>
          index === existingReviewIndex ? data : review
        );
      } else {
        // Nếu không tồn tại, thêm review mới vào danh sách
        updatedReviews = [data, ...reviews];
      }

      // Cập nhật danh sách reviews
      setReviews(updatedReviews);

      // Reset form
      if (!formData.reviewId) {
        // Reset chỉ khi thêm mới
        setFormData({
          itemId: itemId,
          comment: "",
          rating: 0,
          images: [],
          previewImages: [],
          userId: userId || null,
        });
        document.getElementById("imageInput").value = ""; // Xóa giá trị input file
      }

      setErrorMessage("");
      toast.success("Cảm ơn bạn đã đánh giá!");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      setErrorMessage("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const renderStarRatingForReview = (rate) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rate)) {
        // Ngôi sao đầy
        stars.push(
          <i
            key={i}
            className="bi bi-star-fill text-warning me-1 fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => handleRatingChange(i)}
          />
        );
      } else if (i === Math.ceil(rate) && rate % 1 >= 0.5) {
        // Bán ngôi sao
        stars.push(
          <i
            key={i}
            className="bi bi-star-half text-warning me-1 fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => handleRatingChange(i)}
          />
        );
      } else {
        // Ngôi sao rỗng
        stars.push(
          <i
            key={i}
            className="bi bi-star text-warning me-1 fs-5"
            style={{ cursor: "pointer" }}
            onClick={() => handleRatingChange(i)}
          />
        );
      }
    }
    return stars;
  };

  const renderStarRatingForList = (rate) => {
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
    <div className="reviews">
      {/* Form thêm bình luận */}
      <Card className="p-4 mb-4 mt-5">
        <h4 className="mb-4">Thêm đánh giá của bạn:</h4>
        {errorMessage && (
          <div className="alert alert-danger my-2">{errorMessage}</div>
        )}
        <Form>
          <Form.Group controlId="commentInput" className="mb-4">
            <Form.Label className="text-muted">Đánh giá của bạn:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.comment}
              onChange={handleCommentChange}
              placeholder="Nhập bình luận của bạn..."
            />
          </Form.Group>
          <Form.Group
            controlId="ratingInput"
            className="mb-4 d-flex align-items-center"
          >
            <Form.Label className="text-muted me-3 my-auto">
              Mức độ hài lòng:
            </Form.Label>
            <div className="star-rating">
              {renderStarRatingForReview(formData.rating)}
            </div>
          </Form.Group>
          <Form.Group controlId="imageInput" className="mb-4">
            <Form.Label className="text-muted mb-2 my-auto">
              Hình ảnh (Tối đa 3 ảnh):
            </Form.Label>
            <Form.Control type="file" multiple onChange={handleImageChange} />
            {/* Hiển thị ảnh xem trước */}
            {formData.previewImages && formData.previewImages.length > 0 && (
              <div className="d-flex flex-wrap mt-3">
                {formData.previewImages.map((img, idx) => (
                  <div key={idx} className="me-2 mb-2">
                    <Image
                      src={img}
                      thumbnail
                      style={{ width: 100, height: 100 }}
                      alt={`Preview ${idx + 1}`}
                      className="object-fit-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </Form.Group>
          <div className="d-flex justify-content-end align-items-center">
            <Button
              variant="primary"
              className="rounded-1 px-5 py-2"
              onClick={handleCommentSubmit}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" animation="border" />
              ) : !formData.reviewId ? (
                "Gửi đánh giá"
              ) : (
                "Cập nhật đánh giá"
              )}
            </Button>
          </div>
        </Form>
      </Card>

      {/* Hiển thị danh sách bình luận */}
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.reviewId} className="mb-3 shadow-sm py-2">
              <Card.Body>
                <Row className=" px-2">
                  <Col xs="auto" className="">
                    <div className="d-flex justify-content-center align-items-start">
                      <Image
                        src={review.avatar || "/assets/img/avatar-default.png"}
                        roundedCircle
                        width={45}
                        height={45}
                        className="object-fit-cover"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="d-flex justify-content-between">
                      <strong>{review.fullName}</strong>
                      <div className="text-warning">
                        {renderStarRatingForList(review.rating)}
                      </div>
                    </div>
                    <Card.Text className="text-muted small">
                      {review.comment}
                    </Card.Text>
                    {review.images && (
                      <div className="review-images d-flex">
                        {review.images.split(",").map((img, idx) => (
                          <Image
                            key={idx}
                            src={img.trim()} // Loại bỏ khoảng trắng thừa nếu có
                            className="mt-3 me-3 object-fit-cover border-0 p-0 rounded-0"
                            thumbnail
                            style={{ width: 70, height: 70, cursor: "pointer" }}
                            onClick={() => handleImageClick(img.trim())}
                            alt="review-course"
                          />
                        ))}
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-muted">Chưa có đánh giá nào.</p>
        )}
      </div>
      {/* Modal xem ảnh lớn */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body className="p-0 position-relative">
          <Modal.Header
            className="position-absolute end-0 border-0 text-danger"
            closeButton
          ></Modal.Header>
          <Image
            src={currentImage}
            className="object-fit-cover"
            style={{ height: "400px", width: "600px" }}
            fluid
            alt="Ảnh Lớn"
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reviews;
