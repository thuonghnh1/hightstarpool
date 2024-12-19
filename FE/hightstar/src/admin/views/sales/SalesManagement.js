import { useState, useEffect, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  Table,
  Nav,
  Offcanvas,
  Row,
  Col,
  Dropdown,
  Modal,
} from "react-bootstrap";
import { toast } from "react-toastify";
import Select from "react-select"; // thư viện tạo select có hỗ trợ search
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/sales/salesManagement.css";
import SalesService from "../../services/SalesService";
import UserService from "../../services/UserService";
import ModalConfirmInfo from "./ModalConfirmInfo";
import Invoice from "./Invoice";
import PrintComponent from "../../components/common/PrintComponent";
import TicketService from "../../services/TicketService";
import SwimmingTicket from "./SwimmingTicket";

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [cartItems, setCartItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [listDiscountOption, setListDiscountOption] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null); // State cho mã giảm giá
  const [tickets, setTickets] = useState([]);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State cho tìm kiếm
  const [formData, setFormData] = useState({ phoneNumber: "" });
  const [buyer, setBuyer] = useState({});
  const [invoiceData, setInvoiceData] = useState(null); // lưu thông tin hóa đơn
  const [errorFields, setErrorFields] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef();
  // State dùng để quản lý trạng thái hiển thị của các modal
  const [modals, setModals] = useState({
    modalEnterPhone: false,
    modalConfirmInfo: false,
    modal3: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === "tickets") {
          const data = await SalesService.fetchTicketPrices();
          setTickets(data);
        } else if (activeTab === "courses") {
          const data = await SalesService.fetchCourses();
          setCourses(data);
        } else if (activeTab === "products") {
          const data = await SalesService.fetchProducts();
          setProducts(data);
        }
        const data = await SalesService.fetchActiveDiscounts();
        setListDiscountOption(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  // Cập nhật items dựa trên activeTab
  const items =
    activeTab === "tickets"
      ? tickets
      : activeTab === "courses"
      ? courses
      : products;

  const handlePaymentClick = () => {
    setShowInvoice(true);
  };

  const handleCloseOffcanvas = () => setShowInvoice(false);

  const handleAddToCart = (item) => {
    setCartItems((prevItems) => {
      const isCourse = item.id.includes("KH");
      const hasCourseInCart = prevItems.some((cartItem) =>
        cartItem.id.includes("KH")
      );

      // Nếu là khóa học
      if (isCourse) {
        // Kiểm tra giỏ hàng không được chứa bất kỳ sản phẩm nào khác
        if (prevItems.length > 0) {
          toast.error("Khóa học chỉ được phép mua riêng lẻ!", {
            toastId: item.id,
          });
          return prevItems; // Không thêm khóa học mới
        }

        // Thêm khóa học mới vào giỏ
        return [...prevItems, { ...item, quantity: 1 }];
      }

      // Nếu không phải là khóa học
      if (!isCourse) {
        // Kiểm tra nếu đã có khóa học trong giỏ hàng
        if (hasCourseInCart) {
          toast.error("Bạn không thể mua sản phẩm khác khi đã chọn khóa học!", {
            toastId: item.id,
          });
          return prevItems; // Không thêm sản phẩm khác
        }

        // Nếu sản phẩm đã tồn tại, tăng số lượng
        const existingItem = prevItems.find(
          (cartItem) => cartItem.id === item.id
        );
        if (existingItem) {
          return prevItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }

        // Thêm sản phẩm mới vào giỏ
        return [...prevItems, { ...item, quantity: 1 }];
      }

      return prevItems;
    });
  };

  // Tính toán tổng tiền có áp dụng mã giảm giá
  const calculateTotalPrice = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (selectedDiscount) {
      return subtotal * (1 - selectedDiscount.percentage / 100);
    }
    return subtotal;
  };

  const handleDiscountChange = (selectedOption) => {
    setSelectedDiscount(selectedOption);
  };

  // Lọc kết quả theo từ khóa tìm kiếm
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý cập nhật giá trị tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm để mở modal theo tên
  const handleShowModal = (modalName) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: true,
    }));
  };

  // Hàm để đóng modal theo tên
  const handleCloseModal = (modalName) => {
    setModals((prevModals) => ({
      ...prevModals,
      [modalName]: false,
    }));
  };

  // Hàm xử lý khi thay đổi giá trị input
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Số điện thoại không hợp lệ.";
    }

    setErrorFields(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm kiểm tra User đang mua.
  const handleCheckBuyer = async (modalName) => {
    if (validateForm()) {
      try {
        const data = await UserService.getUserByUsername(formData.phoneNumber);
        if (data) {
          setBuyer(data);
          handleCloseModal(modalName);
          toast.success("Cập nhật người mua thành công!");
        }
      } catch (err) {
        // đã xử lý ở service
      }
    }
  };

  const prepareOrderData = (cartItems, buyer, discountId) => {
    // Dữ liệu cho Order
    const orderData = {
      total: calculateTotalPrice(),
      paymentMethod: "UNKNOWN", // Mặc định là chưa xác định
      notes,
      shippingAddress: "Tại quầy",
      discountId,
      userId: buyer.id || null, // Nếu không có buyer, để null
    };

    // Tạo OrderDetails
    const orderDetails = cartItems.flatMap((item) => {
      if (item.id.includes("VB")) {
        return Array.from({ length: item.quantity }, () => ({
          // Đảm bảo các vé cùng loại sẽ được tách ra vì id sẽ là riêng biệt khi tạo hóa đơna
          ticketType: item.type,
          ticketId: null,
          unitPrice: item.price,
          quantity: 1,
        }));
      }

      const detail = {
        quantity: item.quantity,
        unitPrice: item.price * item.quantity,
      };

      if (item.id.includes("SP")) {
        detail.productId = item.id.substring(2); // Bỏ tiền tố để lấy ID
      } else if (item.id.includes("KH")) {
        detail.courseId = item.id.substring(2); // Bỏ tiền tố để lấy ID
      }

      return detail; // Trả về trực tiếp nếu không phải vé bơi
    });

    // Kết hợp dữ liệu Order và OrderDetails
    const invoiceObj = {
      order: orderData,
      orderDetails: orderDetails,
    };

    // Lưu vào state nếu cần sử dụng
    setInvoiceData(invoiceObj);

    return invoiceObj;
  };

  // cập nhật lại ticketId cho đơn hàng
  const updateOrderDetailsWithTickets = (orderDetails, createdTickets) => {
    // Copy danh sách orderDetails để tránh thay đổi trực tiếp
    const updatedOrderDetails = [...orderDetails];

    // Tách createdTickets theo loại vé
    const ticketsByType = createdTickets.reduce((acc, ticket) => {
      if (!acc[ticket.ticketType]) {
        acc[ticket.ticketType] = [];
      }
      acc[ticket.ticketType].push(ticket);
      return acc;
    }, {});
    console.log(ticketsByType);

    // Duyệt qua từng loại vé
    Object.entries(ticketsByType).forEach(([ticketType, tickets]) => {
      // Lấy danh sách orderDetails cho loại vé tương ứng
      let matchingDetails = updatedOrderDetails.filter(
        (detail) => detail.ticketId === null && detail.ticketType === ticketType
      );

      // Gán ticketId vào từng mục orderDetail theo thứ tự
      tickets.forEach((ticket, index) => {
        if (index < matchingDetails.length) {
          matchingDetails[index].ticketId = ticket.id; // Gán ticketId
        }
      });
    });

    return updatedOrderDetails; // Trả về danh sách orderDetails đã được cập nhật
  };

  const clearPage = () => {
    setCartItems([]);
    setBuyer({});
    setInvoiceData(null);
    setNotes("");
    setSelectedDiscount(null);
    setSearchTerm("");
    setShowInvoice(false);
  };

  const handleTicketsLogic = async (tickets) => {
    try {
      const createdTickets = [];
      for (const ticket of tickets) {
        // Gọi API tạo vé
        const createdTicket = await TicketService.createTicket({
          ticketType: ticket.type,
        });

        if (createdTicket) {
          createdTickets.push(createdTicket);

          // Render vé bơi
          const ticketComponent = (
            <SwimmingTicket
              ticketData={createdTicket}
              buyerName={buyer?.fullName}
            />
          );

          // In vé bơi
          await printRef.current.printTicket(ticketComponent);
        }
      }

      return createdTickets;
    } catch (error) {
      console.error("Lỗi khi tạo vé:", error);
      throw error;
    }
  };

  const handleConfirmPayment = async () => {
    const courses = cartItems.filter((item) => item.id.includes("KH"));
    const tickets = cartItems.filter((item) => item.id.includes("VB"));
    // const products = cartItems.filter((item) => item.id.includes("SP"));

    try {
      setIsLoading(true);
      // Chuẩn bị dữ liệu hóa đơn
      const invoice = prepareOrderData(
        cartItems,
        buyer,
        selectedDiscount ? selectedDiscount.value : null
      );

      // Xử lý vé bơi
      if (tickets.length > 0) {
        // Tạo vé bơi và lấy danh sách vé đã tạo
        const createdTickets = await handleTicketsLogic(tickets);

        // Cập nhật danh sách ticketId vào orderDetails
        const updatedOrderDetails = updateOrderDetailsWithTickets(
          invoice.orderDetails,
          createdTickets
        );

        // Gán lại orderDetails đã cập nhật vào invoice
        invoice.orderDetails = updatedOrderDetails;
      }

      // Xử lý khóa học
      if (courses.length > 0) {
        handleShowModal("modalConfirmInfo");
        return;
      }

      // Gọi API tạo hóa đơn
      const orderResponse = await SalesService.createInvoice(invoice);
      if (orderResponse && orderResponse.id) {
        const updatedInvoice = {
          ...invoice,
          order: {
            ...invoice.order,
            orderCode: orderResponse.id,
          },
        };

        setInvoiceData(updatedInvoice);

        // Render hóa đơn
        const invoiceComponent = (
          <Invoice
            buyer={buyer}
            cartItems={cartItems}
            totalPrice={updatedInvoice.order.total}
            discount={selectedDiscount}
            date={new Date().toLocaleString()}
            invoiceCode={updatedInvoice.order.orderCode}
          />
        );

        // In hóa đơn
        await printRef.current.printInvoice(invoiceComponent);
        toast.success("Thanh toán thành công!");
        clearPage();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Có lỗi xảy ra khi thanh toán!");
    } finally {
      setIsLoading(false);
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
              placeholder="Tìm kiếm theo tên hoặc mã..."
              aria-label="Tìm kiếm"
              value={searchTerm} // Liên kết giá trị tìm kiếm
              onChange={handleSearchChange} // Cập nhật khi gõ tìm kiếm
            />
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

          {/* Ghi chú và tổng tiền */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <InputGroup className="w-50">
              <InputGroup.Text>
                <i className="bi bi-pencil"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Ghi chú đơn hàng"
                className="shadow-none"
                onChange={(e) => setNotes(e.target.value)}
              />
            </InputGroup>
            <div className="text-end">
              <strong>Số lượng: </strong> {cartItems.length} <br />
              <strong>Tổng tiền: </strong>{" "}
              {calculateTotalPrice().toLocaleString()}đ
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

          {/* Hiển thị danh sách vé, khóa học, sản phẩm */}
          <div
            className=" overflow-y-auto py-2 border-bottom border-top custom-scrollbar"
            style={{ height: "63vh" }}
          >
            <div className="row g-0">
              {filteredItems.map((item) => (
                <div className="col-md-6 mb-2 pe-2" key={item.id}>
                  {activeTab === "tickets" ? (
                    // Custom card for tickets
                    <div
                      className="card__ticket card bg-gradient bg-primary text-white d-flex flex-column align-items-center justify-content-center"
                      onClick={() => handleAddToCart(item)}
                      style={{ height: "80px", cursor: "pointer" }}
                      title={item.name} // Thêm tooltip
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
                      title={item.name} // Thêm tooltip
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-start object-fit-cover"
                        style={{ width: "70px", height: "100%" }}
                      />
                      <div className="card-body px-2 py-2 overflow-hidden d-flex flex-column justify-content-between">
                        <h6 className="card-title m-0 small text-truncate">
                          {item.name}
                        </h6>
                        <span className="card-subtitle text-muted text-truncate small">
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
          <div className="row mt-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <Select
                options={listDiscountOption} // danh sách giảm giá
                value={selectedDiscount}
                onChange={handleDiscountChange}
                placeholder="Mã giảm giá"
                isClearable
                isSearchable
                isDisabled={cartItems.length === 0}
                menuPlacement="top" // Mở menu lên trên
                styles={{
                  placeholder: (base) => ({
                    ...base,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }),
                }}
              />
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-success fw-bold w-100 text-nowrap"
                onClick={handlePaymentClick}
                disabled={cartItems.length === 0}
              >
                THANH TOÁN
              </button>
            </div>
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
          <Offcanvas.Title className="fw-bold text-uppercase fs-6">
            Thông tin thanh toán
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Thông tin khách hàng */}
          <div className="mb-3">
            <Row className="align-items-center">
              <Col xs={6}>
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    className="p-0 m-0 bg-transparent border-0 text-black"
                  >
                    {buyer.fullName || "Khách"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setBuyer({})}>
                      Khách
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleShowModal("modalEnterPhone")}
                    >
                      Chọn người dùng
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col xs={6} className="text-end">
                <p className="text-muted mb-1">{new Date().toLocaleString()}</p>
              </Col>
            </Row>
          </div>
          <hr />

          {/* Danh sách sản phẩm */}
          <div className="mb-3">
            <h6 className="fw-bold">Chi tiết sản phẩm</h6>
            <ul className="list-unstyled">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <Row className="w-100 g-0">
                    <Col xs={1} className="text-muted">
                      {item.quantity}
                    </Col>
                    <Col xs={5} title={item.name}>
                      {item.name}
                    </Col>
                    <Col xs={3} className="text-end">
                      {item.price.toLocaleString()}đ
                    </Col>
                    <Col xs={3} className="text-end fw-bold">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </Col>
                  </Row>
                </li>
              ))}
            </ul>
          </div>

          <hr />

          {/* Tổng kết hóa đơn */}
          <div className="mb-3">
            <Row>
              <Col xs={8}>Tạm tính:</Col>
              <Col xs={4} className="text-end fw-bold">
                {cartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString()}
                đ
              </Col>
            </Row>
            {selectedDiscount && (
              <Row className="mt-1">
                <Col xs={8}>
                  Giảm giá: <br />({selectedDiscount.label})
                </Col>
                <Col xs={4} className="text-end fw-bold text-success">
                  -{" "}
                  {(
                    cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    ) *
                    (selectedDiscount.percentage / 100)
                  ).toLocaleString()}
                  đ
                </Col>
              </Row>
            )}
            <Row className="mt-3">
              <Col xs={8} className="fw-bold">
                Thành tiền:
              </Col>
              <Col xs={4} className="text-end text-primary fw-bold">
                {calculateTotalPrice().toLocaleString()}đ
              </Col>
            </Row>
          </div>
        </Offcanvas.Body>
        {/* Footer cố định */}
        <div className="offcanvas-footer p-3 border-top">
          <button
            className="btn btn-success fw-bold w-100 text-uppercase"
            onClick={handleConfirmPayment}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              "Xác nhận thanh toán"
            )}
          </button>
        </div>
      </Offcanvas>

      {/* Modal để nhập số điện thoại */}
      <Modal
        show={modals.modalEnterPhone}
        onHide={() => handleCloseModal("modalEnterPhone")}
      >
        <Modal.Header closeButton>
          <Modal.Title>Chọn người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPhoneNumber">
            <Form.Label>
              Số điện thoại <span className="text-danger">(*)</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              maxLength={15}
              onChange={(e) =>
                handleInputChange("phoneNumber", e.target.value.trim())
              }
              isInvalid={!!errorFields.phoneNumber}
              placeholder="Nhập vào số điện thoại người mua"
              required
            />
            <Form.Control.Feedback type="invalid">
              {errorFields.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => handleCloseModal("modalEnterPhone")}
          >
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={() => handleCheckBuyer("modalEnterPhone")}
          >
            Kiểm tra
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác Nhận Thông Tin Người Mua */}
      <ModalConfirmInfo
        show={modals.modalConfirmInfo}
        onHide={() => handleCloseModal("modalConfirmInfo")}
        invoiceData={invoiceData}
        cartItems={cartItems}
        handleClearPage={clearPage}
        printRef={printRef}
        selectedDiscount={selectedDiscount}
        buyer={buyer}
      ></ModalConfirmInfo>

      <PrintComponent ref={printRef} />
    </section>
  );
};

export default SalesManagement;
