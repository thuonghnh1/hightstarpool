import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SiteService from "../../services/SiteService";
import trainerImgDefault from "../../../assets/images/img_sites/trainerImgDefaut.jpg";
import ReactPaginate from "react-paginate";

const TrainerList = ({
  trainers,
  user,
  setLoadingPage,
  setTrainers,
  trainersPerPage,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    trainerId: null,
    rating: 0,
    comment: "",
    userId: user ? user.userId : null,
  });
  const [originalRatings, setOriginalRatings] = useState({});
  const [hoveredRatings, setHoveredRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleStarClick = (trainerId, starRating) => {
    if (!user) {
      toast.warning("Vui lòng đăng nhập để có thể đánh giá!");
      navigate("/login");
      return;
    }

    if (!originalRatings[trainerId]) {
      setOriginalRatings((prevOriginalRatings) => ({
        ...prevOriginalRatings,
        [trainerId]: trainers.find((trainer) => trainer.id === trainerId)
          .rating,
      }));
    }

    setTrainers((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer.id === trainerId
          ? { ...trainer, rating: starRating, review: "" }
          : trainer
      )
    );
    setFormData((prevData) => ({
      ...prevData,
      trainerId,
      rating: starRating, // Cập nhật rating trong formData
      userId: user ? user.userId : null,
    }));
    setModalVisible(true);
  };

  const handleStarHover = (trainerId, starRating) => {
    setHoveredRatings((prevHoveredRatings) => ({
      ...prevHoveredRatings,
      [trainerId]: starRating,
    }));
  };

  const handleStarLeave = (trainerId) => {
    setHoveredRatings((prevHoveredRatings) => ({
      ...prevHoveredRatings,
      [trainerId]: 0,
    }));
  };

  const renderStars = (trainer) => {
    const stars = [];
    const { rating } = trainer;
    const currentRating = hoveredRatings[trainer.id] || rating;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(currentRating)) {
        stars.push(
          <i
            key={i}
            className="bi bi-star-fill text-warning mx-1"
            onClick={() => handleStarClick(trainer.id, i)}
            onMouseEnter={() => handleStarHover(trainer.id, i)}
            onMouseLeave={() => handleStarLeave(trainer.id)}
            style={{ cursor: "pointer" }}
          />
        );
      } else if (i === Math.ceil(currentRating) && currentRating % 1 !== 0) {
        stars.push(
          <i
            key={i}
            className="bi bi-star-half text-warning mx-1"
            onClick={() => handleStarClick(trainer.id, i)}
            onMouseEnter={() => handleStarHover(trainer.id, i)}
            onMouseLeave={() => handleStarLeave(trainer.id)}
            style={{ cursor: "pointer" }}
          />
        );
      } else {
        stars.push(
          <i
            key={i}
            className="bi bi-star text-warning mx-1"
            onClick={() => handleStarClick(trainer.id, i)}
            onMouseEnter={() => handleStarHover(trainer.id, i)}
            onMouseLeave={() => handleStarLeave(trainer.id)}
            style={{ cursor: "pointer" }}
          />
        );
      }
    }

    return stars;
  };

  const handleReviewCancel = () => {
    setTrainers((prevTrainers) =>
      prevTrainers.map((trainer) =>
        trainer.id === formData.trainerId
          ? { ...trainer, rating: originalRatings[formData.trainerId] }
          : trainer
      )
    );
    setModalVisible(false);
    setFormData({ ...formData, comment: "" });
  };

  const handleReviewSubmit = async () => {
    try {
      setLoadingPage(true);
      await SiteService.addOrUpdate(formData);
      toast.success("Đánh giá thành công!");
    } finally {
      setLoadingPage(false);
      setModalVisible(false);
      setFormData({ ...formData, comment: "" });
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const currentTrainers = trainers.slice(
    currentPage * trainersPerPage,
    (currentPage + 1) * trainersPerPage
  );

  return (
    <>
      <div className="container-xxl py-5">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <h6 className="section-title bg-white text-center text-primary px-3">
              Huấn Luyện Viên
            </h6>
            <h1 className="mb-5">Đội Ngũ Huấn Luyện Viên</h1>
          </div>
          <div className="row g-4">
            {currentTrainers.map((trainer) => (
              <div className="col-lg-3 col-md-6 wow fadeInUp" key={trainer.id}>
                <div className="team-item">
                  <div className="overflow-hidden">
                    <img
                      className="img-fluid object-fit-cover w-100"
                      style={{ height: "350px" }}
                      src={trainer.avatar || trainerImgDefault}
                      alt={trainer.fullName}
                    />
                  </div>
                  <div
                    className="position-relative d-flex justify-content-center"
                    style={{ marginTop: "-19px" }}
                  >
                    <Link className="btn btn-square mx-1" href={"#"}>
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link className="btn btn-square mx-1" href={"#"}>
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link className="btn btn-square mx-1" href={"#"}>
                      <i className="fab fa-instagram" />
                    </Link>
                  </div>
                  <div className="text-center p-3 pb-4">
                    <div className="flex-fill text-center mb-3">
                      {renderStars(trainer)}
                    </div>
                    <h5 className="mb-2 fw-bold">{trainer.fullName}</h5>
                    <small className="text-danger fw-medium text-truncate">
                      {trainer.specialty}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-5">
            <ReactPaginate
              previousLabel={"Trước"}
              nextLabel={"Sau"}
              breakLabel={"..."}
              pageCount={Math.ceil(trainers.length / trainersPerPage)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        show={modalVisible}
        onHide={handleReviewCancel}
        centered
        backdrop="static"
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>Đánh Giá Huấn Luyện Viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6>Sao đã chọn: {formData.rating} sao</h6>
          <Form.Group controlId="reviewText">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Nhập nhận xét của bạn"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReviewCancel}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Gửi Đánh Giá
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrainerList;
