import React, { useState } from 'react';
import { Pagination, Modal, Button, Form } from 'react-bootstrap';
import "../../css/TicketManagement.css";

function TicketManagement() {

    // Định nghĩa cho pagination
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
        // Xử lý logic thêm vé tại đây
        handleCloseModal(); // Đóng modal sau khi submit
    };

    return (
        <div className="container">
            <h4>Danh sách vé</h4>

            <div className="d-flex justify-content-between ">
                <div className="d-flex ">
                    <button className="btn btn-outline-success me-2" type="button">
                        <i className="fa-solid fa-filter"></i> Lọc
                    </button>
                    <button className="btn btn-outline-success me-2" type="button" onClick={handleShowModal}>
                        <i className="fa-solid fa-plus"></i> Thêm
                    </button>
                </div>
                <form className="d-flex" role="search">
                    <input className="form-control me-2 w-100" type="search" placeholder="nhập mã vé để tìm" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
            </div>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã Vé</th>
                        <th scope="col">Ngày Phát Hành</th>
                        <th scope="col">Ngày Hết Hạn</th>
                        <th scope="col">Loại Vé</th>
                        <th scope="col">Mã Sinh Viên</th>
                        <th scope="col">Trạng Thái</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>V001</td>
                        <td>01/09/2024</td>
                        <td>01/12/2024</td>
                        <td>Vé Tuần</td>
                        <td>SV001</td>
                        <td>Còn hạn</td>
                        <td className="ps-3">
                            <i className="fa-regular fa-eye m-2 "></i>
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can"></i> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>V002</td>
                        <td>01/09/2024</td>
                        <td>01/12/2024</td>
                        <td>Vé tháng</td>
                        <td>SV002</td>
                        <td>Hết hạn</td>
                        <td className="ps-3">
                            <i className="fa-regular fa-eye m-2 "></i>
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can"></i> 
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>V003</td>
                        <td>01/09/2024</td>
                        <td>01/12/2024</td>
                        <td>Vé năm</td>
                        <td>SV003</td>
                        <td>Còn hạn</td>
                        <td className="ps-3">
                            <i className="fa-regular fa-eye m-2 "></i>
                            <i className="fa-solid fa-pen m-2"></i>
                            <i className="fa-solid fa-trash-can"></i> 
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

            {/* Modal thêm vé */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Vé</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formTicketCode">
                            <Form.Label>Mã vé</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã vé" required />
                        </Form.Group>

                        <Form.Group controlId="formIssueDate" className="mt-3">
                            <Form.Label>Ngày phát hành</Form.Label>
                            <Form.Control type="date" required />
                        </Form.Group>

                        <Form.Group controlId="formExpiryDate" className="mt-3">
                            <Form.Label>Ngày hết hạn</Form.Label>
                            <Form.Control type="date" required />
                        </Form.Group>

                        <Form.Group controlId="formTicketType" className="mt-3">
                            <Form.Label>Loại vé</Form.Label>
                            <Form.Control as="select" required>
                                <option value="">Chọn loại vé</option>
                                <option value="weekly">Vé tuần</option>
                                <option value="monthly">Vé tháng</option>
                                <option value="yearly">Vé năm</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formStudentCode" className="mt-3">
                            <Form.Label>Mã sinh viên</Form.Label>
                            <Form.Control type="text" placeholder="Nhập mã sinh viên" required />
                        </Form.Group>

                        <Form.Group controlId="formStatus" className="mt-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control as="select" required>
                                <option value="">Chọn trạng thái</option>
                                <option value="active">Còn hạn</option>
                                <option value="expired">Hết hạn</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Thêm Vé
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TicketManagement;
