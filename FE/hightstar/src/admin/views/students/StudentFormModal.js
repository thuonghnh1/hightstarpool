import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function StudentFormModal({ show, handleClose, handleSave, editingStudent }) {
    const [student, setStudent] = useState({
        id: '',
        name: '',
        nickname: '',
        age: '',
        gender: 'Nam',
        note: '',
        userId: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editingStudent) {
            setStudent(editingStudent);
        } else {
            setStudent({ id: '', name: '', nickname: '', age: '', gender: 'Nam', note: '', userId: '' });
        }
    }, [editingStudent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent((prevStudent) => ({
            ...prevStudent,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Reset error message for the field being changed
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!student.id) newErrors.id = 'Mã HV không được để trống.';
        if (!student.name) newErrors.name = 'Họ tên không được để trống.';
        if (!student.age) newErrors.age = 'Tuổi không được để trống.';
        else if (student.age < 1) newErrors.age = 'Tuổi phải lớn hơn 0.';
        if (!student.userId) newErrors.userId = 'Mã ND không được để trống.';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        handleSave(student);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{editingStudent ? 'Chỉnh sửa Học Viên' : 'Thêm Học Viên Mới'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formId">
                        <Form.Label>Mã HV</Form.Label>
                        <Form.Control
                            type="text"
                            name="id"
                            value={student.id}
                            onChange={handleChange}
                            isInvalid={!!errors.id}
                            disabled={!!editingStudent} // Khóa trường này khi chỉnh sửa
                        />
                        <Form.Control.Feedback type="invalid">{errors.id}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Họ Tên</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={student.name}
                            onChange={handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formNickname">
                        <Form.Label>Biệt Danh</Form.Label>
                        <Form.Control
                            type="text"
                            name="nickname"
                            value={student.nickname}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formAge">
                        <Form.Label>Tuổi</Form.Label>
                        <Form.Control
                            type="number"
                            name="age"
                            value={student.age}
                            onChange={handleChange}
                            isInvalid={!!errors.age}
                        />
                        <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='gender mt-3 mb-3'>Giới Tính</Form.Label>
                        <Form.Check className='checkform ms-5 j'
                            inline
                            type="radio"
                            label="Nam"
                            name="gender"
                            value="Nam"
                            checked={student.gender === 'Nam'}
                            onChange={handleChange}
                            id="genderMale"
                        />
                        <Form.Check
                            inline
                            type="radio"
                            label="Nữ"
                            name="gender"
                            value="Nữ"
                            checked={student.gender === 'Nữ'}
                            onChange={handleChange}
                            id="genderFemale"
                        />
                    </Form.Group>
                    <Form.Group controlId="formNote">
                        <Form.Label>Ghi Chú</Form.Label>
                        <Form.Control
                            type="text"
                            name="note"
                            value={student.note}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formUserId">
                        <Form.Label>Mã ND</Form.Label>
                        <Form.Control
                            type="text"
                            name="userId"
                            value={student.userId}
                            onChange={handleChange}
                            isInvalid={!!errors.userId}
                            disabled={!!editingStudent} // Khóa trường này khi chỉnh sửa
                        />
                        <Form.Control.Feedback type="invalid">{errors.userId}</Form.Control.Feedback>
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Đóng
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            Lưu
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default StudentFormModal;
