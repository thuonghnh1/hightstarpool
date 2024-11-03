import React, { useState } from "react";
import { Button, Form, InputGroup, Table, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [cartItems, setCartItems] = useState([]);

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
  ];

  const items = activeTab === "courses" ? courses : products;

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
        <div className="col-md-7 p-4">
          {/* Search Bar and Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Control
              className="w-50"
              placeholder="Tìm khóa học hoặc sản phẩm"
              aria-label="Tìm khóa học hoặc sản phẩm"
            />
            <Button variant="outline-primary" className="mx-2">
              Hóa đơn 1
            </Button>
            <Button variant="success">
              <i className="bi bi-funnel-fill"></i> Lọc
            </Button>
          </div>

          {/* Cart Table */}
          <Table hover className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Mã</th>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
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
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-light  btn-sm ms-1"
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
                      +
                    </button>
                  </td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td>
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

          {/* Order Note and Total */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Control placeholder="Ghi chú đơn hàng" className="w-50" />
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
        <div className="col-md-5 p-4 border-start">
          {/* Tabs for Courses and Products */}
          <Nav
            variant="tabs"
            activeKey={activeTab}
            onSelect={(selectedKey) => setActiveTab(selectedKey)}
            className=""
          >
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

          {/* Display List */}
          <div className="row overflow-y-auto py-3" style={{height: '63vh'}}>
            {items.map((item) => (
              <div className="col-lg-6 mb-3" key={item.id}>
                <div
                  className="card h-100 d-flex flex-row"
                  onClick={() => handleAddToCart(item)}
                  style={{maxHeight: "80px"}}
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
              </div>
            ))}
          </div>

          {/* Pagination and Checkout Button */}
          <div className="row py-0 mt-3">
            <nav className="col-md-6">
              <ul className="pagination m-0">
                <li className="page-item active">
                  <button
                    className="page-link"
                    onClick={() => {
                      /* handle page 1 click */
                    }}
                  >
                    1
                  </button>
                </li>
                <li className="page-item">
                  <button
                    className="page-link"
                    onClick={() => {
                      /* handle page 2 click */
                    }}
                  >
                    2
                  </button>
                </li>
              </ul>
            </nav>
            <div className=" col-md-6 text-end align-content-end">
              <button className="btn btn-success fw-bold w-100">THANH TOÁN</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalesManagement;
