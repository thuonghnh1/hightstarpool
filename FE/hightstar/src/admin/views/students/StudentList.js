import React, { useState } from 'react';
import StudentFormModal from './StudentFormModal';
import { Pagination, Table, Button } from 'react-bootstrap';

function StudentList() {
    const [students, setStudents] = useState([
        { id: 'HV01', name: 'Nguyễn Văn A', nickname: 'Cún', age: '12', gender: 'Nam', note: '', userId: 'ND01' },
        { id: 'HV02', name: 'Nguyễn Thị B', nickname: 'Cặng', age: '15', gender: 'Nữ', note: '', userId: 'ND02' }
    ]);

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

    const [showAddModal, setShowAddModal] = useState(false);
    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    // Xử lý khi lưu học viên mới
    const handleSaveStudent = (newStudent) => {
        setStudents((prevStudents) => [...prevStudents, newStudent]);
        handleCloseAddModal(); // Đóng modal sau khi lưu
    };

    // State quản lý học viên đang được chỉnh sửa
    const [editingStudent, setEditingStudent] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Hàm mở modal và thiết lập học viên đang được chỉnh sửa
    const handleEdit = (student) => {
        setEditingStudent(student);
        setShowEditModal(true);
    };

    // Hàm xử lý khi nhấn nút "Lưu" trong modal chỉnh sửa
    const handleSaveEdit = (updatedStudent) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) => (student.id === updatedStudent.id ? updatedStudent : student))
        );
        setShowEditModal(false);
    };

    // Hàm xử lý khi nhấn nút xóa
    const handleDelete = (id) => {

        setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));

    };

    // Chọn học viên hiển thị theo trang
    const studentsToDisplay = students.slice((currentPage - 1) * 5, currentPage * 5);

    return (
        <div className="student-list">
            <div className="container student-list my-4">
                <h3 className="mb-4">DANH SÁCH HỌC VIÊN</h3>
                <div className="actions d-flex mb-3">
                    <div className="search-bar me-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm"
                        />
                    </div>
                    <Button variant="secondary" className="me-2">
                        <i className="bi bi-search"></i>
                    </Button>
                    <Button variant="success" className="me-2">
                        <i className="bi bi-funnel"></i>
                    </Button>
                    <Button variant="warning" onClick={handleShowAddModal}>
                        Thêm
                    </Button>
                </div>
            </div>

            <Table striped bordered hover className="student-table">
                <thead>
                    <tr>
                        <th scope="col">HÀNH ĐỘNG</th>
                        <th scope="col">MÃ HV</th>
                        <th scope="col">HỌ TÊN HV</th>
                        <th scope="col">BIỆT DANH</th>
                        <th scope="col">TUỔI</th>
                        <th scope="col">GIỚI TÍNH</th>
                        <th scope="col">GHI CHÚ</th>
                        <th scope="col">MÃ ND</th>
                    </tr>
                </thead>
                <tbody>
                    {studentsToDisplay.map((student) => (
                        <tr key={student.id}>
                            <td>
                                <Button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(student)}>
                                    <i className="bi bi-pencil-square"></i>
                                </Button>
                                <Button className="btn btn-danger btn-sm" onClick={() => handleDelete(student.id)}>
                                    <i className="bi bi-trash3"></i>
                                </Button>
                            </td>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.nickname}</td>
                            <td>{student.age}</td>
                            <td>{student.gender}</td>
                            <td>{student.note}</td>
                            <td>{student.userId}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal để thêm học viên mới */}
            <StudentFormModal
                show={showAddModal}
                handleClose={handleCloseAddModal}
                handleSave={handleSaveStudent}
            />

            {/* Modal chỉnh sửa học viên */}
            <StudentFormModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                handleSave={handleSaveEdit}
                editingStudent={editingStudent}
            />

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
        </div>
    );
}

export default StudentList;
