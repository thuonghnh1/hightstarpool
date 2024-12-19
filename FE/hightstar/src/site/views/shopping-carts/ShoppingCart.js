import { useState, useEffect, useContext } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { UserContext } from "../../../contexts/UserContext";
import { CartContext } from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import UserProfileService from "../../../admin/services/UserProfileService";
import { toast } from "react-toastify";

const ShoppingCart = () => {
  const { user } = useContext(UserContext);
  const { shoppingCartItems, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);

  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    fullName: "",
    phoneNumber: "",
    shippingAddress: "",
    phoneNumber: "",
    notes: "",
    totalAmount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Lấy thông tin hồ sơ người dùng khi `user` thay đổi
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      setLoadingPage(true);
      try {
        const profile = await UserProfileService.getProfileByUserId(
          user.userId
        );

        if (profile) {
          setCheckoutData((prevData) => ({
            ...prevData,
            fullName: profile.fullName || "",
            phoneNumber: profile.phoneNumber || "",
            shippingAddress: profile.shippingAddress || "",
          }));
        } else {
          console.warn("Không tìm thấy hồ sơ người dùng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin hồ sơ người dùng:", error);
      } finally {
        setLoadingPage(false);
      }
    };

    if (user && user.userId) {
      fetchUserProfile();
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Tính tổng tiền trong giỏ hàng
  const totalPriceInCart = shoppingCartItems.reduce(
    (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
    0
  );

  useEffect(() => {
    setCheckoutData((prevData) => ({
      ...prevData,
      totalAmount: totalPriceInCart,
    }));
  }, [totalPriceInCart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const prepareOrderData = (cartItems) => {
    // Dữ liệu cho Order
    const orderData = {
      total: checkoutData.totalAmount,
      paymentMethod: "BANK_TRANSFER", // Mặc định là chưa xác định
      notes: checkoutData.notes,
      shippingAddress: checkoutData.shippingAddress,
      discountId: null,
      userId: user.userId,
    };
    console.log(cartItems);
    // Tạo OrderDetails
    const orderDetails = cartItems.map((item) => {
      const detail = {
        quantity: item.quantity,
        unitPrice: item.unitPrice * item.quantity,
        productId: item.product.productId,
      };

      return detail; // Trả về trực tiếp nếu không phải vé bơi
    });

    // Kết hợp dữ liệu Order và OrderDetails
    const invoiceObj = {
      order: orderData,
      orderDetails: orderDetails,
    };

    return invoiceObj;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shoppingCartItems || shoppingCartItems.length === 0) {
      toast.error(
        "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán."
      );
      return;
    }
    setLoadingPage(true);
    try {
      // Xử lý thanh toán
      console.log(prepareOrderData(shoppingCartItems)); // thông tin để lưu vào csdl

      clearCart(); // Làm trống giỏ hàng sau khi thanh toán
      setCheckoutSuccess(true);
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
    } finally {
      setLoadingPage(false);
    }
  };

  const handleCloseSuccess = () => setCheckoutSuccess(false);

  return (
    <>
      <Helmet>
        <title>Giỏ Hàng - Hight Star</title>
      </Helmet>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <section className="container h-100 px-4 py-3 mt-3 bg-white shopping-container">
          <div className="container">
            <div className="row d-flex justify-content-center my-4">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">
                      Có{" "}
                      <span className="text-danger">
                        {shoppingCartItems.length}
                      </span>{" "}
                      sản phẩm trong giỏ
                    </h5>
                  </div>
                  <div className="card-body">
                    {shoppingCartItems && shoppingCartItems.length > 0 ? (
                      shoppingCartItems.map((item) => (
                        <div key={item.cartItemId}>
                          <div className="row">
                            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                              <div
                                className="bg-image hover-overlay hover-zoom ripple rounded"
                                data-mdb-ripple-color="light"
                              >
                                <a
                                  href={`/shopaa/sites/product-detail/${item.product.productId}`}
                                  className="text-decoration-none"
                                >
                                  <img
                                    src={item.product.image}
                                    className="w-100"
                                    alt={item.product.name}
                                  />
                                </a>
                                <a href="#!">
                                  <div
                                    className="mask"
                                    style={{
                                      backgroundColor:
                                        "rgba(251, 251, 251, 0.2)",
                                    }}
                                  ></div>
                                </a>
                              </div>
                            </div>

                            <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                              <p className="mb-2">
                                <strong className="fs-5 text-truncate">
                                  {item.product.name}
                                </strong>
                              </p>
                              <p
                                style={{ fontSize: "14px" }}
                                className="mb-3 text-muted"
                              >
                                <span className="fw-bold me-2">Size:</span>
                                <span>{item.size || "M"}</span>
                              </p>
                              <div
                                className="d-flex mb-4"
                                style={{ maxWidth: "300px" }}
                              >
                                <button
                                  className="btn btn-sm rounded-0 text-light"
                                  style={{ backgroundColor: "blue" }}
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      Math.max(item.quantity - 1, 1)
                                    )
                                  }
                                  type="button"
                                >
                                  <i className="fas fa-minus"></i>
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  name="quantity"
                                  style={{ width: "55px", fontSize: "14px" }}
                                  className="form-control rounded-0 text-center"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    if (value >= 1) {
                                      updateQuantity(item.cartItemId, value);
                                    }
                                  }}
                                />
                                <button
                                  className="btn btn-sm rounded-0 text-light"
                                  style={{ backgroundColor: "blue" }}
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity + 1
                                    )
                                  }
                                  type="button"
                                >
                                  <i className="fas fa-plus"></i>
                                </button>
                              </div>
                            </div>

                            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 d-flex align-items-center justify-content-end">
                              <div className="me-5">
                                <strong>
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item.unitPrice)}
                                </strong>
                              </div>
                              <button
                                type="button"
                                className="btn text-light btn-danger"
                                onClick={() => removeFromCart(item.cartItemId)}
                                title="Remove item"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                          <hr className="my-4" />
                        </div>
                      ))
                    ) : (
                      <p>Giỏ hàng của bạn đang trống!</p>
                    )}
                  </div>
                </div>

                <div className="card mb-4 mb-lg-0">
                  <div className="card-body">
                    <p className="mb-3">
                      <strong>Chúng tôi chấp nhận thanh toán bằng:</strong>
                    </p>
                    <img
                      className="me-3"
                      width="75px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                      alt="Visa"
                    />
                    <img
                      className="me-3"
                      width="75px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                      alt="American Express"
                    />
                    <img
                      className="me-3"
                      width="75px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                      alt="Mastercard"
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-header py-3">
                    <h5 className="mb-0">Tóm tắt</h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Giá sản phẩm:
                        <span>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPriceInCart)}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center px-0 pb-4">
                        Phí vận chuyển:
                        <span>Miễn phí</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mt-4 mb-3">
                        <div>
                          <strong>Tổng tiền cần thanh toán:</strong>
                          <strong>
                            <p className="mb-0">(Bao gồm VAT)</p>
                          </strong>
                        </div>
                        <span className="fs-5 fw-bold">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(totalPriceInCart)}
                        </span>
                      </li>
                    </ul>
                    <div className="d-flex">
                      <button
                        type="button"
                        className="me-auto btn btn-block rounded-0 px-4 py-2 text-white text-nowrap"
                        style={{ backgroundColor: "red" }}
                        onClick={clearCart}
                      >
                        Xóa tất cả
                      </button>
                      <button
                        type="button"
                        className="btn btn-block rounded-0 px-5 py-2 text-white text-nowrap"
                        style={{ backgroundColor: "blue" }}
                        onClick={() => setShowModal(true)}
                      >
                        Mua Hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Checkout */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <form id="checkoutForm" onSubmit={handleCheckout}>
              <Modal.Header closeButton>
                <Modal.Title>Thông tin giao hàng</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Tên người nhận
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={checkoutData.fullName}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={checkoutData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">
                    Địa chỉ giao hàng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={checkoutData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder="Số nhà, tên đường..."
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">
                    Ghi chú
                  </label>
                  <textarea
                    rows={4}
                    className="form-control"
                    id="notes"
                    name="notes"
                    value={checkoutData.notes}
                    onChange={handleInputChange}
                    placeholder="Ghi chú..."
                    required
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="me-auto d-flex align-items-center">
                  <label htmlFor="totalAmount" className="form-label me-2">
                    Tổng tiền:
                  </label>
                  <span className="fs-5 fw-bold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(checkoutData.totalAmount)}
                  </span>
                  <input
                    type="hidden"
                    name="totalAmount"
                    value={checkoutData.totalAmount}
                  />
                </div>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Đóng
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ backgroundColor: "blue" }}
                >
                  Xác Nhận Mua
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

          {/* Thông báo thanh toán thành công */}
          <Modal show={checkoutSuccess} onHide={handleCloseSuccess} centered>
            <Modal.Header closeButton>
              <Modal.Title>Thanh Toán Thành Công</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được xử lý thành
                công.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleCloseSuccess}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      )}
    </>
  );
};

export default ShoppingCart;
