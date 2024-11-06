import React, { useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  Table,
  Nav,
  Offcanvas,
  Row,
  Col,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/sales/salesManagement.css";

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [cartItems, setCartItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);

  const handlePayment1Click = () => {
    setShowInvoice(true);
  };

  const handleCloseOffcanvas = () => setShowInvoice(false);
  const tickets = [
    { id: "V01", name: "Vé dùng 1 lần", price: 60000 },
    { id: "V02", name: "Vé tuần", price: 400000 },
    { id: "V03", name: "Vé tháng", price: 1500000 },
  ];

  const courses = [
    { id: "BF01", name: "Bơi ếch", type: "1 kèm 4", price: 3000000 },
    { id: "BS02", name: "Bơi sải", type: "1 kèm 2", price: 3000000 },
    { id: "BS03", name: "Bơi sải nâng cao", type: "1 kèm 1", price: 3000000 },
    { id: "BS04", name: "Bơi ếch nâng cao", type: "1 kèm 2", price: 3000000 },
    { id: "BF05", name: "Bơi bướm", type: "1 kèm 4", price: 3000000 },
    { id: "BS06", name: "Bơi bướm nâng cao", type: "1 kèm 4", price: 3000000 },
    { id: "BS07", name: "Bơi ngữa", type: "1 kèm 4", price: 3000000 },
    {
      id: "BS08",
      name: "Kỹ năng bơi chống đuổi nước",
      type: "1 kèm 4",
      price: 3000000,
    },
    { id: "BS09", name: "Bơi bướm nâng cao", type: "1 kèm 4", price: 3000000 },
    { id: "BS011", name: "Bơi ngữa", type: "1 kèm 4", price: 3000000 },
    {
      id: "BS012",
      name: "Kỹ năng bơi chống đuổi nước",
      type: "1 kèm 4",
      price: 3000000,
    },
  ];

  const products = [
    { id: "SP01", name: "Nước uống", type: "Đồ ăn", price: 15000 },
    { id: "SP02", name: "Snack", type: "Áo quần", price: 10000 },
    { id: "SP03", name: "Mì tôm trứng", type: "Đồ ăn", price: 15000 },
  ];

  // Cập nhật items dựa trên activeTab
  const items =
    activeTab === "tickets"
      ? tickets
      : activeTab === "courses"
      ? courses
      : products;

  const handleAddToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  return (
    <section className="row m-0 p-0 bg-white rounded-3 h-100">
      <div className="row g-0">
        {/* Left Side: Cart */}
        <div className="col-lg-7 p-4">
          {/* Search Bar and Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              className="w-50 shadow-none"
              placeholder="Tìm khóa học hoặc sản phẩm"
              aria-label="Tìm khóa học hoặc sản phẩm"
            />
            {/* <Button variant="outline-primary" className="mx-2">
              Hóa đơn 1
            </Button> */}
            <Button variant="success">
              <i className="bi bi-funnel-fill"></i> Lọc
            </Button>
          </div>

          {/* Cart Table */}
          <div
            className="overflow-y-auto table-responsive custom-scrollbar"
            style={{ height: "60vh" }}
          >
            <Table hover className="text-center">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th className="text-nowrap">Số lượng</th>
                  <th>Giá</th>
                  <th>Tổng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id} className="">
                    <td className="align-middle">{item.id}</td>
                    <td className="text-truncate align-middle">{item.name}</td>
                    <td className="align-middle text-nowrap">
                      <button
                        className="btn btn-light btn-sm me-1"
                        onClick={() =>
                          setCartItems(
                            cartItems.map((cartItem) =>
                              cartItem.id === item.id && cartItem.quantity > 1
                                ? {
                                    ...cartItem,
                                    quantity: cartItem.quantity - 1,
                                  }
                                : cartItem
                            )
                          )
                        }
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="btn btn-light btn-sm ms-1"
                        onClick={() =>
                          setCartItems(
                            cartItems.map((cartItem) =>
                              cartItem.id === item.id
                                ? {
                                    ...cartItem,
                                    quantity: cartItem.quantity + 1,
                                  }
                                : cartItem
                            )
                          )
                        }
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </td>
                    <td className="align-middle">
                      {item.price.toLocaleString()}đ
                    </td>
                    <td className="align-middle">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </td>
                    <td className="align-middle">
                      <button
                        className="btn text-danger btn-sm"
                        onClick={() =>
                          setCartItems(
                            cartItems.filter(
                              (cartItem) => cartItem.id !== item.id
                            )
                          )
                        }
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* Order Note and Total */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <InputGroup className="w-50">
              <InputGroup.Text>
                <i className="bi bi-pencil"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Ghi chú đơn hàng"
                className="shadow-none"
              />
            </InputGroup>
            <div className="text-end">
              <strong>Số lượng: </strong> {cartItems.length} <br />
              <strong>Tổng tiền: </strong>{" "}
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toLocaleString()}
              đ
            </div>
          </div>
        </div>

        {/* Right Side: Courses / Products List */}
        <div className="col-lg-5 p-4 border-start">
          {/* Tabs for Courses and Products */}
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            className="border-0"
          >
            <Nav.Item>
              <Nav.Link eventKey="tickets" className="fw-bold ">
                Vé bơi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="courses" className="fw-bold ">
                Khóa học
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="products" className="fw-bold">
                Sản phẩm
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Hiển thị danh sách khóa học, sản phẩm */}
          <div
            className=" overflow-y-auto py-3 border-bottom border-top custom-scrollbar"
            style={{ height: "63vh" }}
          >
            <div className="row g-0">
              {items.map((item) => (
                <div className="col-md-6 mb-2 pe-2" key={item.id}>
                  {activeTab === "tickets" ? (
                    // Custom card for tickets
                    <div
                      className="card__ticket card bg-gradient bg-primary text-white d-flex flex-column align-items-center justify-content-center"
                      onClick={() => handleAddToCart(item)}
                      style={{ height: "80px", cursor: "pointer" }}
                    >
                      <h6 className="card-title mb-1 text-center">
                        {item.name}
                      </h6>
                      <p className="card-text fw-bold">
                        {item.price.toLocaleString()}đ
                      </p>
                    </div>
                  ) : (
                    <div
                      className="card__sales card d-flex flex-row bg-body-tertiary"
                      onClick={() => handleAddToCart(item)}
                      style={{ height: "80px", cursor: "pointer" }}
                    >
                      <img
                        src="https://boidat.com/wp-content/uploads/2024/04/z4610703450640_e29a9e4149977230a446f105682e6d71-2048x1536.jpg"
                        alt={item.name}
                        className="rounded-start object-fit-cover"
                        style={{ width: "70px", height: "100%" }}
                      />
                      <div className="card-body px-2 py-2 text-truncate">
                        <h6 className="card-title m-0 small text-truncate">
                          {item.name}
                        </h6>
                        <span className="card-subtitle text-muted small">
                          {item.type}
                        </span>
                        <p className="card-text text-danger text fw-bold small">
                          {item.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 ">
            <button
              className="btn btn-success fw-bold w-100 text-nowrap"
              onClick={handlePayment1Click}
            >
              THANH TOÁN
            </button>
          </div>
        </div>
      </div>
      {/* Offcanvas cho thông tin hóa đơn */}
      <Offcanvas
        show={showInvoice}
        onHide={handleCloseOffcanvas}
        placement="end"
        className="offcanvas-invoice"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">
            Hóa đơn thanh toán
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Thông tin khách hàng */}
          <div className="mb-3">
            <Row className="align-items-center">
              <Col xs={8}>
                <p className="mb-1">
                  Khách hàng: <strong>Tên khách hàng</strong>
                </p>
              </Col>
              <Col xs={4} className="text-end">
                <p className="text-muted mb-1">24/09/2024 - 14:17</p>
              </Col>
            </Row>
          </div>
          <hr />

          {/* Danh sách sản phẩm */}
          <div className="mb-3">
            <h6 className="fw-bold">Chi tiết sản phẩm</h6>
            <ul className="list-unstyled">
              <li className="d-flex justify-content-between align-items-center">
                <span>Mũ bơi</span>
                <span className="text-muted">Số lượng: 1 x 300,000</span>
                <strong>300,000</strong>
              </li>
              <li className="d-flex justify-content-between align-items-center">
                <span>Kính bơi</span>
                <span className="text-muted">Số lượng: 2 x 450,000</span>
                <strong>900,000</strong>
              </li>
            </ul>
          </div>
          <hr />

          {/* Tổng kết hóa đơn */}
          <div className="mb-3">
            <Row>
              <Col xs={8}>Tổng tiền:</Col>
              <Col xs={4} className="text-end fw-bold">
                1,200,000
              </Col>
            </Row>
            <Row>
              <Col xs={8}>Giảm giá:</Col>
              <Col xs={4} className="text-end fw-bold">
                0
              </Col>
            </Row>
            <Row>
              <Col xs={8}>Khách cần trả:</Col>
              <Col xs={4} className="text-end text-primary fw-bold">
                1,200,000
              </Col>
            </Row>
            <Row className="mt-2">
              <Col xs={8}>Khách thanh toán:</Col>
              <Col xs={4} className="text-end fw-bold">
                1,500,000
              </Col>
            </Row>
            <Row>
              <Col xs={8}>Tiền thừa trả khách:</Col>
              <Col xs={4} className="text-end text-success fw-bold">
                300,000
              </Col>
            </Row>
          </div>

          {/* Nút xác nhận thanh toán */}
          <div className="text-center mt-4">
            <Button variant="success" className="w-100 py-2">
              Xác nhận thanh toán
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
};

export default SalesManagement;
