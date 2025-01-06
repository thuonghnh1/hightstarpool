import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { formatCurrency } from "../utils/formatCurrency";

function CourseList({ courses, coursesPerPage = 3 }) {
  // State để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  // Tính toán số trang cần thiết
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Cắt danh sách khóa học theo trang hiện tại
  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected);
  };

  const handleNavigateDetails = (course) => {
    // Điều hướng tới URL với ID khóa học, đồng thời truyền toàn bộ đối tượng `course` qua state
    navigate(`/course/${course.id}`, {
      state: { course }, // Truyền đối tượng course qua state
    });
  };

  const startIndex = currentPage * coursesPerPage;
  const currentCourses = courses.slice(startIndex, startIndex + coursesPerPage);

  return (
    <div className="container-xxl py-5">
      <div className="container">
        <div className="text-center">
          <h6 className="section-title bg-white text-center text-primary px-3">
            Khóa Học
          </h6>
          <h1 className="mb-5">Khám Phá Các Khóa Học Bơi</h1>
        </div>
        <div className="row g-4 justify-content-center">
          {currentCourses.map((course) => (
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
                      onClick={()=>handleNavigateDetails(course)}
                    >
                      Xem chi tiết
                    </div>
                    <div
                      className="btn btn-sm btn-primary px-3"
                      style={{ borderRadius: "0 30px 30px 0" }}
                      onClick={()=>handleNavigateDetails(course)}
                    >
                      Tư vấn ngay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center mt-5">
          <ReactPaginate
            previousLabel={"Trước"}
            nextLabel={"Tiếp"}
            breakLabel={"..."}
            pageCount={totalPages}
            onPageChange={handlePageChange}
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
  );
}

export default CourseList;
