import React, { useState } from 'react';
import { Pagination, Modal, Button, Form } from 'react-bootstrap';
//QLy khóa học nha

function CourseManagement() {

    //định nghĩa cho pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // Số trang thực tế của bạn
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Modal state để mở/đóng modal
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Hàm xử lý form submit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic thêm khóa học tại đây
        handleCloseModal(); // Đóng modal sau khi submit
    };

    return (
        <div className="container-fluid">
            <h4>Danh sách khóa học</h4>

            {/* <div className="d-flex justify-content-between ">
                <form className="d-flex " role="search" >
                    <input className="form-control me-2 w-100" type="search" placeholder="nhập tên khóa học để tìm" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form>
                <div className="d-flex ">
                    <button className="btn btn-outline-success me-2 " type="submit">
                        <i className="fa-solid fa-filter"></i> Filter
                    </button>
                    <button className="btn btn-outline-success me-2" type="submit" onClick={handleShowModal}>
                        <i className="fa-solid fa-plus"></i> Thêm
                    </button>
                   
                </div>
            </div> */}
            <div className="row">
                <div className="col-md-6 mb-2">
                    {/* <form className="d-flex " role="search" >
                    <input className="form-control me-2 w-100" type="search" placeholder="nhập tên khóa học để tìm" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
                </form> */}
                    <form className="d-flex w-100" role="search">
                        <div className="input-group">
                            <input className="form-control" type="search" placeholder="Tìm kiếm khóa học" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                    <button className="btn btn-outline-success me-2 " type="submit">
                        <i className="fa-solid fa-filter"></i> Filter
                    </button>
                    <button className="btn btn-outline-success me-2" type="submit" onClick={handleShowModal}>
                        <i className="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
            </div>
            <table class="table table-responsive table-bordered mt-3">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã KH</th>
                        <th scope="col">Lớp</th>
                        <th scope="col">Bắt Đầu</th>
                        <th scope="col">Kết Thúc</th>
                        <th scope="col">Ca Học</th>
                        <th scope="col">Học Phí</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>KH001</td>
                        <td>SW001</td>
                        <td>12/9/2024</td>
                        <td>10/01/2025</td>
                        <td>15h-17h</td>
                        <td>3.000.000đ</td>
                        <td className="ps-3">
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can "></i>
                        </td>


                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>KH002</td>
                        <td>SW002</td>
                        <td>12/9/2024</td>
                        <td>10/01/2025</td>
                        <td>15h-17h</td>
                        <td>3.000.000đ</td>
                        <td className="ps-3">
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can "></i>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>KH003</td>
                        <td>SW003</td>
                        <td>12/9/2024</td>
                        <td>10/01/2025</td>
                        <td>15h-17h</td>
                        <td>2.000.000đ</td>
                        <td className="ps-3">
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can "></i>
                        </td>
                    </tr>

                </tbody>
            </table>

            <Pagination className="justify-content-center">
                <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                        key={index}
                        active={currentPage === index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
            </Pagination>


            {/* Modal thêm khóa học */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Khóa Học</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formCourseCode">
                            <Form.Label>Mã khóa học</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã khóa học" required />
                        </Form.Group>

                        <Form.Group controlId="formClassCode" className="mt-3">
                            <Form.Label>Lớp</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã lớp" required />
                        </Form.Group>

                        <Form.Group controlId="formStartDate" className="mt-3">
                            <Form.Label>Ngày bắt đầu</Form.Label>
                            <Form.Control type="date" required />
                        </Form.Group>

                        <Form.Group controlId="formEndDate" className="mt-3">
                            <Form.Label>Ngày kết thúc</Form.Label>
                            <Form.Control type="date" required />
                        </Form.Group>

                        <Form.Group controlId="formSchedule" className="mt-3">
                            <Form.Label>Ca học</Form.Label>
                            <Form.Control type="text" placeholder="Nhập ca học (ví dụ: 15h-17h)" required />
                        </Form.Group>

                        <Form.Group controlId="formFee" className="mt-3">
                            <Form.Label>Học phí</Form.Label>
                            <Form.Control type="number" placeholder="Nhập học phí (đơn vị: VNĐ)" required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Thêm Khóa Học
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>



        </div>
    )
}



export default CourseManagement;