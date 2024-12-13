// import { useState, useEffect, useContext } from "react";
// import { Modal, Button, Spinner } from "react-bootstrap"; // Sử dụng React Bootstrap cho modal
// import { Helmet } from "react-helmet-async";
// import { UserContext } from "../../../contexts/UserContext";
// import { useNavigate } from "react-router-dom";

// const ShoppingCart = () => {
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();
//   const [loadingPage, setLoadingPage] = useState(false); // này để load cho toàn bộ trang dữ liệu
//   // Khởi tạo dữ liệu giỏ hàng từ localStorage hoặc sử dụng dữ liệu mẫu
//   const initialCartItems = JSON.parse(
//     localStorage.getItem("shoppingCartItems")
//   ) || [
//     {
//       cartItemId: 1,
//       product: {
//         productId: 101,
//         name: "Áo Sơ Mi Xanh",
//         image: "https://via.placeholder.com/150",
//       },
//       quantity: 2,
//       unitPrice: 1799000,
//       color: "Xanh lá",
//       size: "M",
//     },
//     {
//       cartItemId: 2,
//       product: {
//         productId: 102,
//         name: "Quần Jeans Đen",
//         image: "https://via.placeholder.com/150",
//       },
//       quantity: 1,
//       unitPrice: 2599000,
//       color: "Đen",
//       size: "32",
//     },
//   ];

//   const [shoppingCartItems, setShoppingCartItems] = useState(initialCartItems);
//   const [totalPriceInCart, setTotalPriceInCart] = useState(0);
//   const [checkoutData, setCheckoutData] = useState({
//     fullName: "Nguyễn Văn A", // Giả lập dữ liệu người dùng
//     phoneNumber: "0123456789",
//     shippingAddress: "123 Đường ABC, Quận 1, TP. HCM",
//     totalAmount: 0,
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [checkoutSuccess, setCheckoutSuccess] = useState(false);

//   // Tính tổng tiền trong giỏ hàng
//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     setLoadingPage(true);
//     const total = shoppingCartItems.reduce(
//       (acc, item) => acc + item.unitPrice * item.quantity,
//       0
//     );
//     setTotalPriceInCart(total);
//     setCheckoutData((prevData) => ({ ...prevData, totalAmount: total }));

//     // Lưu trữ giỏ hàng vào localStorage
//     localStorage.setItem(
//       "shoppingCartItems",
//       JSON.stringify(shoppingCartItems)
//     );
//     setLoadingPage(false);
//   }, [shoppingCartItems, user, navigate]);

//   // Xử lý thay đổi số lượng sản phẩm
//   const handleQuantityChange = (itemId, newQuantity) => {
//     const updatedItems = shoppingCartItems.map((item) => {
//       if (item.cartItemId === itemId) {
//         return { ...item, quantity: newQuantity };
//       }
//       return item;
//     });
//     setShoppingCartItems(updatedItems);
//   };

//   // Xử lý xóa sản phẩm khỏi giỏ
//   const handleRemoveItem = (itemId) => {
//     const updatedItems = shoppingCartItems.filter(
//       (item) => item.cartItemId !== itemId
//     );
//     setShoppingCartItems(updatedItems);
//   };

//   // Xử lý thay đổi input trong form checkout
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCheckoutData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Xử lý thanh toán
//   const handleCheckout = (e) => {
//     e.preventDefault();
//     // Giả lập gọi API và xử lý thanh toán
//     console.log("Checkout Data:", checkoutData);
//     // Sau khi thanh toán thành công, làm trống giỏ hàng
//     setShoppingCartItems([]);
//     setCheckoutSuccess(true);
//     setShowModal(false);
//   };

//   // Đóng thông báo thanh toán thành công
//   const handleCloseSuccess = () => setCheckoutSuccess(false);

//   return (
//     <>
//       <Helmet>
//         <title>Trang chủ - Hight Star</title>
//       </Helmet>
//       {loadingPage ? (
//         <div className="w-100 h-100 d-flex justify-content-center align-items-center">
//           <Spinner animation="border" variant="primary" className=""></Spinner>
//         </div>
//       ) : (
//         <section className="container h-100 px-4 py-3 mt-3 bg-white shopping-container">
//           <div className="container">
//             <div className="row d-flex justify-content-center my-4">
//               <div className="col-md-8">
//                 <div className="card mb-4">
//                   <div className="card-header py-3">
//                     {/* Hiển thị số lượng sản phẩm trong giỏ hàng */}
//                     <h5 className="mb-0">
//                       Có{" "}
//                       <span className="text-danger">
//                         {shoppingCartItems.length}
//                       </span>{" "}
//                       sản phẩm trong giỏ
//                     </h5>
//                   </div>
//                   <div className="card-body">
//                     {shoppingCartItems && shoppingCartItems.length > 0 ? (
//                       shoppingCartItems.map((item) => (
//                         <div key={item.cartItemId}>
//                           <div className="row">
//                             <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
//                               {/* Hiển thị hình ảnh sản phẩm */}
//                               <div
//                                 className="bg-image hover-overlay hover-zoom ripple rounded"
//                                 data-mdb-ripple-color="light"
//                               >
//                                 <a
//                                   href={`/shopaa/sites/product-detail/${item.product.productId}`}
//                                   className="text-decoration-none"
//                                 >
//                                   <img
//                                     src={item.product.image}
//                                     className="w-100"
//                                     alt={item.product.name}
//                                   />
//                                 </a>
//                                 <a href="#!">
//                                   <div
//                                     className="mask"
//                                     style={{
//                                       backgroundColor:
//                                         "rgba(251, 251, 251, 0.2)",
//                                     }}
//                                   ></div>
//                                 </a>
//                               </div>
//                             </div>

//                             <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
//                               {/* Hiển thị tên sản phẩm */}
//                               <p className="mb-2">
//                                 <strong className="fs-5 text-truncate">
//                                   {item.product.name}
//                                 </strong>
//                               </p>
//                               <p
//                                 style={{ fontSize: "14px" }}
//                                 className="mb-2 text-muted"
//                               >
//                                 <span className="fw-bold me-2">Màu sắc:</span>
//                                 <span>{item.color || "Xanh lá"}</span>
//                               </p>
//                               <p
//                                 style={{ fontSize: "14px" }}
//                                 className="mb-3 text-muted"
//                               >
//                                 <span className="fw-bold me-2">
//                                   Kích thước:
//                                 </span>
//                                 <span>{item.size || "M"}</span>
//                               </p>
//                               {/* Hiển thị số lượng và nút tăng/giảm */}
//                               <div
//                                 className="d-flex mb-4"
//                                 style={{ maxWidth: "300px" }}
//                               >
//                                 <button
//                                   className="btn btn-sm rounded-0 text-light"
//                                   style={{
//                                     backgroundColor: "blue",
//                                   }}
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item.cartItemId,
//                                       Math.max(item.quantity - 1, 1)
//                                     )
//                                   }
//                                   type="button"
//                                 >
//                                   <i className="fas fa-minus"></i>
//                                 </button>
//                                 <input
//                                   type="number"
//                                   min="1"
//                                   name="quantity"
//                                   style={{ width: "55px", fontSize: "14px" }}
//                                   className="form-control rounded-0 text-center"
//                                   value={item.quantity}
//                                   onChange={(e) => {
//                                     const value = parseInt(e.target.value);
//                                     if (value >= 1) {
//                                       handleQuantityChange(
//                                         item.cartItemId,
//                                         value
//                                       );
//                                     }
//                                   }}
//                                 />
//                                 <button
//                                   className="btn btn-sm rounded-0 text-light"
//                                   style={{
//                                     backgroundColor: "blue",
//                                   }}
//                                   onClick={() =>
//                                     handleQuantityChange(
//                                       item.cartItemId,
//                                       item.quantity + 1
//                                     )
//                                   }
//                                   type="button"
//                                 >
//                                   <i className="fas fa-plus"></i>
//                                 </button>
//                                 <input
//                                   type="hidden"
//                                   name="cartItemId"
//                                   value={item.cartItemId}
//                                 />
//                               </div>
//                             </div>

//                             <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 d-flex align-items-center justify-content-end">
//                               {/* Hiển thị đơn giá sản phẩm */}
//                               <div className="me-5">
//                                 <strong>
//                                   {new Intl.NumberFormat("vi-VN", {
//                                     style: "currency",
//                                     currency: "VND",
//                                   }).format(item.unitPrice)}
//                                 </strong>
//                               </div>
//                               {/* Nút xóa sản phẩm khỏi giỏ */}
//                               <button
//                                 type="button"
//                                 className="btn text-light btn-danger"
//                                 onClick={() =>
//                                   handleRemoveItem(item.cartItemId)
//                                 }
//                                 title="Remove item"
//                               >
//                                 <i className="fas fa-trash"></i>
//                               </button>
//                             </div>
//                           </div>
//                           <hr className="my-4" />
//                         </div>
//                       ))
//                     ) : (
//                       <p>Giỏ hàng của bạn đang trống!</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="card mb-4 mb-lg-0">
//                   <div className="card-body">
//                     <p className="mb-3">
//                       <strong>Chúng tôi chấp nhận thanh toán bằng:</strong>
//                     </p>
//                     <img
//                       className="me-3"
//                       width="75px"
//                       src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
//                       alt="Visa"
//                     />
//                     <img
//                       className="me-3"
//                       width="75px"
//                       src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
//                       alt="American Express"
//                     />
//                     <img
//                       className="me-3"
//                       width="75px"
//                       src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
//                       alt="Mastercard"
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-4">
//                 <div className="card mb-4">
//                   <div className="card-header py-3">
//                     <h5 className="mb-0">Tóm tắt</h5>
//                   </div>
//                   <div className="card-body">
//                     <ul className="list-group list-group-flush">
//                       <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
//                         Giá sản phẩm:
//                         <span>
//                           {new Intl.NumberFormat("vi-VN", {
//                             style: "currency",
//                             currency: "VND",
//                           }).format(totalPriceInCart)}
//                         </span>
//                       </li>
//                       <li className="list-group-item d-flex justify-content-between align-items-center px-0 pb-4">
//                         Phí vận chuyển:
//                         <span>Miễn phí</span>
//                       </li>
//                       <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mt-4 mb-3">
//                         <div>
//                           <strong>Tổng tiền cần thanh toán:</strong>
//                           <strong>
//                             <p className="mb-0">(Bao gồm VAT)</p>
//                           </strong>
//                         </div>
//                         <span className="fs-5 fw-bold">
//                           {new Intl.NumberFormat("vi-VN", {
//                             style: "currency",
//                             currency: "VND",
//                           }).format(totalPriceInCart)}
//                         </span>
//                       </li>
//                     </ul>

//                     <button
//                       type="button"
//                       className="btn btn-block rounded-0 px-5 py-2 text-white"
//                       style={{ backgroundColor: "blue" }}
//                       onClick={() => setShowModal(true)}
//                     >
//                       Mua Hàng
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Modal Checkout */}
//           <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//             <form id="checkoutForm" onSubmit={handleCheckout}>
//               <Modal.Header closeButton>
//                 <Modal.Title>Thông tin giao hàng</Modal.Title>
//               </Modal.Header>
//               <Modal.Body>
//                 <div className="mb-3">
//                   <label htmlFor="fullName" className="form-label">
//                     Tên người nhận
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="fullName"
//                     name="fullName"
//                     value={checkoutData.fullName}
//                     readOnly
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="phoneNumber" className="form-label">
//                     Số điện thoại
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="phoneNumber"
//                     name="phoneNumber"
//                     value={checkoutData.phoneNumber}
//                     onChange={handleInputChange}
//                     placeholder="Nhập số điện thoại"
//                     required
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="shippingAddress" className="form-label">
//                     Địa chỉ giao hàng
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="shippingAddress"
//                     name="shippingAddress"
//                     value={checkoutData.shippingAddress}
//                     onChange={handleInputChange}
//                     placeholder="Số nhà, tên đường..."
//                     required
//                   />
//                 </div>
//               </Modal.Body>
//               <Modal.Footer>
//                 <div className="me-auto d-flex align-items-center">
//                   <label htmlFor="totalAmount" className="form-label me-2">
//                     Tổng tiền:
//                   </label>
//                   <span className="fs-5 fw-bold">
//                     {new Intl.NumberFormat("vi-VN", {
//                       style: "currency",
//                       currency: "VND",
//                     }).format(checkoutData.totalAmount)}
//                   </span>
//                   <input
//                     type="hidden"
//                     name="totalAmount"
//                     value={checkoutData.totalAmount}
//                   />
//                 </div>
//                 <Button variant="secondary" onClick={() => setShowModal(false)}>
//                   Đóng
//                 </Button>
//                 <Button
//                   variant="primary"
//                   type="submit"
//                   style={{ backgroundColor: "blue" }}
//                 >
//                   Xác Nhận Mua
//                 </Button>
//               </Modal.Footer>
//             </form>
//           </Modal>

//           {/* Thông báo thanh toán thành công */}
//           <Modal show={checkoutSuccess} onHide={handleCloseSuccess} centered>
//             <Modal.Header closeButton>
//               <Modal.Title>Thanh Toán Thành Công</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <p>
//                 Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được xử lý thành
//                 công.
//               </p>
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="primary" onClick={handleCloseSuccess}>
//                 Đóng
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </section>
//       )}
//     </>
//   );
// };

// export default ShoppingCart;

import { useState, useEffect, useContext } from "react";
import { Modal, Button, Spinner } from "react-bootstrap"; // Sử dụng React Bootstrap cho modal
import { Helmet } from "react-helmet-async";
import { UserContext } from "../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(false); // để load cho toàn bộ trang dữ liệu

  // Khởi tạo dữ liệu giỏ hàng từ localStorage hoặc sử dụng mảng rỗng
  const initialCartItems =
    JSON.parse(localStorage.getItem("shoppingCartItems")) || [];

  const [shoppingCartItems, setShoppingCartItems] = useState(initialCartItems);
  const [totalPriceInCart, setTotalPriceInCart] = useState(0);
  const [checkoutData, setCheckoutData] = useState({
    fullName: "Nguyễn Văn A", // Giả lập dữ liệu người dùng
    phoneNumber: "0123456789",
    shippingAddress: "123 Đường ABC, Quận 1, TP. HCM",
    totalAmount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Tính tổng tiền trong giỏ hàng
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowModal(false);
    setLoadingPage(true);

    const total = shoppingCartItems.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
      0
    );
    setTotalPriceInCart(total);
    setCheckoutData((prevData) => ({ ...prevData, totalAmount: total }));

    // Lưu trữ giỏ hàng vào localStorage
    localStorage.setItem(
      "shoppingCartItems",
      JSON.stringify(shoppingCartItems)
    );
    setLoadingPage(false);
  }, [shoppingCartItems, user, navigate]);

  // Xử lý thay đổi số lượng sản phẩm
  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedItems = shoppingCartItems.map((item) => {
      if (item.cartItemId === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setShoppingCartItems(updatedItems);
  };

  // Xử lý xóa sản phẩm khỏi giỏ
  const handleRemoveItem = (itemId) => {
    const updatedItems = shoppingCartItems.filter(
      (item) => item.cartItemId !== itemId
    );
    setShoppingCartItems(updatedItems);
  };

  // Xử lý thay đổi input trong form checkout
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Xử lý thanh toán
  const handleCheckout = (e) => {
    e.preventDefault();
    // Giả lập gọi API và xử lý thanh toán
    console.log("Checkout Data:", checkoutData);
    // Sau khi thanh toán thành công, làm trống giỏ hàng
    setShoppingCartItems([]);
    setCheckoutSuccess(true);
    setShowModal(false);
  };

  // Đóng thông báo thanh toán thành công
  const handleCloseSuccess = () => setCheckoutSuccess(false);
  const clearCart = () => {
    // Xóa tất cả sản phẩm trong giỏ hàng
    setShoppingCartItems([]);

    // Cập nhật lại localStorage (xóa giỏ hàng trong localStorage)
    localStorage.removeItem("shoppingCartItems");

    // Cập nhật lại tổng tiền giỏ hàng
    setTotalPriceInCart(0);

    // Cập nhật lại dữ liệu thanh toán
    setCheckoutData((prevState) => ({
      ...prevState,
      totalAmount: 0,
    }));

    // Nếu có modal, đóng nó
    setShowModal(false);
  };

  return (
    <>
      <Helmet>
        <title>Trang chủ - Hight Star</title>
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
                    {/* Hiển thị số lượng sản phẩm trong giỏ hàng */}
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
                      shoppingCartItems.map((item) => {
                        if (!item.product || !item.product.productId) {
                          return (
                            <div
                              key={item.cartItemId}
                              className="alert alert-danger"
                            >
                              Dữ liệu sản phẩm không hợp lệ.
                            </div>
                          );
                        }

                        return (
                          <div key={item.cartItemId}>
                            <div className="row">
                              <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                                {/* Hiển thị hình ảnh sản phẩm */}
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
                                {/* Hiển thị tên sản phẩm */}
                                <p className="mb-2">
                                  <strong className="fs-5 text-truncate">
                                    {item.product.name}
                                  </strong>
                                </p>
                                <p
                                  style={{ fontSize: "14px" }}
                                  className="mb-3 text-muted"
                                >
                                  <span className="fw-bold me-2">
                                    Kích thước:
                                  </span>
                                  <span>{item.size || "M"}</span>
                                </p>
                                {/* Hiển thị số lượng và nút tăng/giảm */}
                                <div
                                  className="d-flex mb-4"
                                  style={{ maxWidth: "300px" }}
                                >
                                  <button
                                    className="btn btn-sm rounded-0 text-light"
                                    style={{
                                      backgroundColor: "blue",
                                    }}
                                    onClick={() =>
                                      handleQuantityChange(
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
                                        handleQuantityChange(
                                          item.cartItemId,
                                          value
                                        );
                                      }
                                    }}
                                  />
                                  <button
                                    className="btn btn-sm rounded-0 text-light"
                                    style={{
                                      backgroundColor: "blue",
                                    }}
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.cartItemId,
                                        item.quantity + 1
                                      )
                                    }
                                    type="button"
                                  >
                                    <i className="fas fa-plus"></i>
                                  </button>
                                  <input
                                    type="hidden"
                                    name="cartItemId"
                                    value={item.cartItemId}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 d-flex align-items-center justify-content-end">
                                {/* Hiển thị đơn giá sản phẩm */}
                                <div className="me-5">
                                  <strong>
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(item.unitPrice)}
                                  </strong>
                                </div>
                                {/* Nút xóa sản phẩm khỏi giỏ */}
                                <button
                                  type="button"
                                  className="btn text-light btn-danger"
                                  onClick={() =>
                                    handleRemoveItem(item.cartItemId)
                                  }
                                  title="Remove item"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </div>
                            <hr className="my-4" />
                          </div>
                        );
                      })
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

                    <button
                      type="button"
                      className="btn btn-block rounded-0 px-5 py-2 text-white"
                      style={{ backgroundColor: "blue" }}
                      onClick={() => setShowModal(true)}
                    >
                      Mua Hàng
                    </button>
                    <button
                      type="button"
                      className="btn btn-block rounded-0 px-5 py-2 text-white"
                      style={{ backgroundColor: "red" }}
                      onClick={clearCart}
                    >
                      Xóa tất cả
                    </button>
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
