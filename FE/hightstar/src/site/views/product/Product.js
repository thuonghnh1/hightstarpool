import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { Spinner } from "react-bootstrap";

const ClothingCard = ({
  title,
  description,
  price,
  images,
  sizes,
  onAddToCart,
  productId, // Đảm bảo nhận được productId
}) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [currentImage, setCurrentImage] = useState(images[0]);

  return (
    <div className="col">
      <div
        className="card h-100"
        onMouseEnter={() => setCurrentImage(images[1] || images[0])}
        onMouseLeave={() => setCurrentImage(images[0])}
      >
        <img src={currentImage} className="card-img-top" alt={title} />
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <h6 className="text-primary">{price}</h6>
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
              {sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-success w-100 mt-3"
            onClick={() =>
              onAddToCart({
                productId, // Đảm bảo truyền productId
                title,
                description,
                price,
                selectedSize,
                image: images[0],
              })
            }
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [loadingPage, setLoadingPage] = useState(false);
  const [products, setProducts] = useState([]);
  const [shoppingCartItems, setShoppingCartItems] = useState(
    JSON.parse(localStorage.getItem("shoppingCartItems")) || []
  );

  const fetchProducts = async () => {
    try {
      setLoadingPage(true);
      const fetchedProducts = [
        {
          title: "Áo Thun Nam",
          description: "Áo thun nam chất liệu cotton thoáng mát.",
          price: "150.000đ",
          images: [
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200?text=Image+2",
          ],
          sizes: ["S", "M", "L", "XL"],
          category: "Áo quần",
          productId: 3,
        },
        {
          title: "Quần Jeans Nữ",
          description: "Quần jeans nữ dáng ôm, chất liệu co giãn tốt.",
          price: "300.000đ",
          images: [
            "https://via.placeholder.com/300x200",
            "https://via.placeholder.com/300x200?text=Image+2",
          ],
          sizes: ["S", "M", "L"],
          category: "Áo quần",
          productId: 4,
        },
      ];
      // Lọc chỉ lấy sản phẩm "Áo quần"
      const clothingProducts = fetchedProducts.filter(
        (product) => product.category === "Áo quần"
      );
      setProducts(clothingProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPage(false);
    }
  };

  const addToCart = (item) => {
    const cartItem = {
      cartItemId: new Date().getTime(),
      product: {
        productId: item.productId,
        name: item.title,
        image: item.image || "",
      },
      quantity: 1,
      unitPrice: parseFloat(item.price.replace(/\D/g, "")),
      size: item.selectedSize || null,
    };

    const updatedCartItems = [...shoppingCartItems, cartItem];
    setShoppingCartItems(updatedCartItems);
    localStorage.setItem("shoppingCartItems", JSON.stringify(updatedCartItems));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const renderProducts = () => {
    return products.map((product, index) => {
      return <ClothingCard key={index} {...product} onAddToCart={addToCart} />;
    });
  };

  return (
    <>
      {loadingPage ? (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" variant="primary" />
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
              <h2>Đồ bơi</h2>
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

export default App;
