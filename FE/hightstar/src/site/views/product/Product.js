import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import ProductService from "../../../admin/services/ProductService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import debounce from "lodash.debounce";

// Hàm định dạng giá
const formatPrice = (price) => {
  if (typeof price !== "number") return "";
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

const ClothingCard = ({
  title,
  description,
  unitPrice,
  image,
  sizes,
  discount = 0,
  stock,
  onAddToCart,
  productId,
}) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = unitPrice - (unitPrice * discount) / 100;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Vui lòng chọn size trước khi thêm vào giỏ.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const item = {
      productId,
      title,
      description,
      unitPrice: discountedPrice,
      selectedSize,
      quantity,
      image: image || "",
      stock,
    };

    onAddToCart(item);
  };

  return (
    <div className="col">
      <div className="card h-100">
        <img src={image} className="card-img-top" alt={title} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>

          {/* Phần hiển thị giá */}
          <div className="mt-auto">
            {discount > 0 ? (
              <div className="d-flex align-items-center">
                <h6 className="text-danger me-2 mb-0">
                  {formatPrice(discountedPrice)}
                </h6>
                <small className="text-muted mb-0">
                  <s>{formatPrice(unitPrice)}</s>
                </small>
              </div>
            ) : (
              <h6 className="text-primary mb-0">{formatPrice(unitPrice)}</h6>
            )}
          </div>

          {/* Phần chọn size */}
          <div className="mt-3">
            <label htmlFor={`sizeSelect-${productId}`} className="form-label">
              Chọn Size:
            </label>
            <select
              id={`sizeSelect-${productId}`}
              className="form-select"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes && sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <option key={index} value={size}>
                    {size}
                  </option>
                ))
              ) : (
                <option value="">Không có kích cỡ</option>
              )}
            </select>
          </div>

          {/* Phần điều khiển số lượng */}
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="mx-3">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setQuantity((prev) => (prev < stock ? prev + 1 : prev))
              }
              disabled={quantity >= stock}
            >
              +
            </button>
            <span className="ms-3 text-muted">Còn lại: {stock}</span>{" "}
            {/* Hiển thị stock */}
          </div>

          {/* Nút thêm vào giỏ */}
          <button
            className="btn btn-success w-100 mt-3"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0 ? "Hết Hàng" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Product = () => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [products, setProducts] = useState([]);
  const [shoppingCartItems, setShoppingCartItems] = useState(
    JSON.parse(localStorage.getItem("shoppingCartItems")) || []
  );
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Hàm lấy sản phẩm từ API
  const fetchProducts = async () => {
    try {
      setLoadingPage(true);
      const fetchedProducts = await ProductService.getProducts();

      const mappedProducts = fetchedProducts.map((product) => ({
        title: product.productName,
        description: product.description,
        unitPrice: product.discountedPrice || product.price, // Đổi từ price thành unitPrice
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : product.image,
        sizes:
          product.sizes && product.sizes.length > 0
            ? product.sizes
            : ["S", "M", "L", "XL"],
        discount: product.discount ? product.discount * 100 : 0,
        productId: product.id,
        stock: product.stock || 0,
      }));

      let filteredProducts = mappedProducts;

      // Lọc sản phẩm theo từ khóa tìm kiếm
      if (searchTerm.trim() !== "") {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sắp xếp sản phẩm
      if (sortOption === "price-asc") {
        filteredProducts.sort((a, b) => a.unitPrice - b.unitPrice);
      } else if (sortOption === "price-desc") {
        filteredProducts.sort((a, b) => b.unitPrice - a.unitPrice);
      } else if (sortOption === "name-asc") {
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortOption === "name-desc") {
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setError("Đã xảy ra lỗi khi tải sản phẩm.");
    } finally {
      setLoadingPage(false);
    }
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (item) => {
    // Kiểm tra unitPrice hợp lệ
    if (isNaN(item.unitPrice) || item.unitPrice <= 0) {
      toast.error("Giá sản phẩm không hợp lệ.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa (cùng productId và size)
    const existingItemIndex = shoppingCartItems.findIndex(
      (cartItem) =>
        cartItem.product.productId === item.productId &&
        cartItem.size === item.selectedSize
    );

    let updatedCartItems = [];

    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, kiểm tra tổng số lượng không vượt quá stock
      const existingItem = shoppingCartItems[existingItemIndex];
      const newQuantity = existingItem.quantity + item.quantity;

      if (newQuantity > item.stock) {
        // Nếu vượt quá stock, giới hạn số lượng và thông báo lỗi
        toast.error(`Số lượng tối đa cho sản phẩm này là ${item.stock}.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return; // Thoát hàm để không thêm vào giỏ
      }

      // Cập nhật số lượng
      updatedCartItems = shoppingCartItems.map((cartItem, index) => {
        if (index === existingItemIndex) {
          return {
            ...cartItem,
            quantity: newQuantity,
          };
        }
        return cartItem;
      });
    } else {
      // Nếu sản phẩm chưa tồn tại, kiểm tra số lượng không vượt quá stock
      if (item.quantity > item.stock) {
        toast.error(`Số lượng tối đa cho sản phẩm này là ${item.stock}.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return; // Thoát hàm để không thêm vào giỏ
      }

      // Thêm mới vào giỏ hàng
      const cartItem = {
        cartItemId: new Date().getTime(),
        product: {
          productId: item.productId,
          name: item.title,
          image: item.image || "",
        },
        quantity: item.quantity, // Số lượng được chọn
        unitPrice: parseFloat(item.unitPrice), // Đảm bảo unitPrice là số
        size: item.selectedSize || null,
      };
      updatedCartItems = [...shoppingCartItems, cartItem];
    }

    setShoppingCartItems(updatedCartItems);
    localStorage.setItem("shoppingCartItems", JSON.stringify(updatedCartItems));

    // Thêm thông báo thành công
    toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  // Hàm hiển thị sản phẩm
  const renderProducts = () => {
    if (products.length === 0) {
      return <p>Không có sản phẩm nào phù hợp với tìm kiếm của bạn.</p>;
    }

    return products.map((product) => (
      <ClothingCard
        key={product.productId}
        title={product.title}
        description={product.description}
        unitPrice={product.unitPrice}
        image={product.image}
        sizes={product.sizes}
        discount={parseFloat(product.discount)}
        stock={product.stock}
        onAddToCart={addToCart}
        productId={product.productId}
      />
    ));
  };

  // Sử dụng useCallback và debounce để tối ưu hóa tìm kiếm khi người dùng gõ
  const debouncedFetchProducts = useCallback(
    debounce(() => {
      fetchProducts();
    }, 500), // 500ms debounce
    [searchTerm, sortOption]
  );

  useEffect(() => {
    debouncedFetchProducts();

    // Cleanup function để hủy debounce khi component unmount
    return debouncedFetchProducts.cancel;
  }, [searchTerm, sortOption, debouncedFetchProducts]);

  return (
    <>
      <ToastContainer />
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div>
          {/* Hero Header */}
          <div className="container-fluid bg-primary py-5 mb-5 hero-header">
            <div className="container py-5">
              <div className="row justify-content-center py-5">
                <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                  <h1 className="display-3 text-white animated slideInDown">
                    Sản Phẩm Của Chúng Tôi
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                      <li className="breadcrumb-item">
                        <NavLink to="/" className="text-decoration-none">
                          Trang Chủ
                        </NavLink>
                      </li>
                      <li
                        className="breadcrumb-item text-white active"
                        aria-current="page"
                      >
                        Sản phẩm
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          {/* Product Listing */}
          <div className="container-xxl py-5">
            <div className="container">
              {/* Tiêu đề */}
              <h2 className="mb-4 text-center">Tất cả sản phẩm</h2>

              {/* Thanh tìm kiếm và sắp xếp */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tìm kiếm sản phẩm..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={fetchProducts}
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  {/* Dropdown sắp xếp */}
                  <select
                    className="form-select w-auto"
                    value={sortOption}
                    onChange={handleSort}
                  >
                    <option value="">Sắp xếp</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A đến Z</option>
                    <option value="name-desc">Tên: Z đến A</option>
                  </select>
                </div>
              </div>

              {/* Danh Sách Sản Phẩm */}
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {renderProducts()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
