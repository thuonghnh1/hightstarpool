import React from "react";
import { Button, Table, Form, Row, Col } from "react-bootstrap";

const DiscountManagement = () => {
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Danh Sách Ưu Đãi</h3>
      <Row className="mb-3">
        <Col md={8}>
          <Form.Control type="text" placeholder="Tìm kiếm" />
        </Col>
        <Col md={4} className="d-flex justify-content-end">
          <Button variant="success" className="me-2">
            <i className="bi bi-filter"></i> Lọc
          </Button>
          <Button variant="primary" className="me-2">
            <i className="bi bi-plus-circle"></i> Thêm Ưu Đãi
          </Button>
        </Col>
      </Row>

      <Table bordered hover >
        <thead>
          <tr>
            <th>Hành Động</th>
            <th>Mã Ưu Đãi</th>
            <th>Tên Ưu Đãi</th>
            <th>Ngày Bắt Đầu</th>
            <th>Ngày Kết Thúc</th>
            <th>Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Button variant="outline-primary" className="me-2">
                <i className="bi bi-eye"></i>
              </Button>
              <Button variant="outline-secondary" className="me-2">
                <i className="bi bi-pencil"></i>
              </Button>
              <Button variant="outline-danger">
                <i className="bi bi-trash"></i>
              </Button>
            </td>
            <td>UD01</td>
            <td>Khuyến Mãi 10%</td>
            <td>01/01/2024</td>
            <td>31/01/2024</td>
            <td>Đang Áp Dụng</td>
          </tr>
          <tr>
            <td>
              <Button variant="outline-primary" className="me-2">
                <i className="bi bi-eye"></i>
              </Button>
              <Button variant="outline-secondary" className="me-2">
                <i className="bi bi-pencil"></i>
              </Button>
              <Button variant="outline-danger">
                <i className="bi bi-trash"></i>
              </Button>
            </td>
            <td>UD02</td>
            <td>Giảm Giá 20%</td>
            <td>15/02/2024</td>
            <td>15/03/2024</td>
            <td>Hết Hạn</td>
          </tr>
        </tbody>
      </Table>

      <div className="d-flex justify-content-between">
        <span>Số bản ghi</span>
        <Form.Select aria-label="Số bản ghi" className="w-auto">
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </Form.Select>
        <span>2 trên 50 ưu đãi</span>
      </div>
    </div>
  );
};

export default DiscountManagement;
