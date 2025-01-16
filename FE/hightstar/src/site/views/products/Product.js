import React, { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import ProductService from "../../../site/services/ProductService";
import { ToastContainer } from "react-toastify";
import debounce from "lodash.debounce";
import ClothingCard from "./ClothingCard";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      const fetchedProducts = await ProductService.getProducts();
      let filteredProducts = fetchedProducts.map((product) => ({
        title: product.productName,
        description: product.description,
        unitPrice: product.discountedPrice || product.price,
        image: product.image,
        discount: product.discount || 0,
        productId: product.id,
        stock: product.stock || 0,
      }));

      // Search filter
      if (searchTerm.trim()) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort filter
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
    }
  }, [searchTerm, sortOption]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchProducts();
    }, 500);

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [fetchProducts]);

  return (
    <>
      <ToastContainer />
      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          <div className="container-fluid bg-primary mb-sm-5 hero-header">
            <div className="container py-5">
              <div className="row justify-content-center py-5">
                <div className="col-lg-10 pt-lg-5 mt-lg-5 text-center">
                  <h1 className="display-3 text-white animated slideInDown">
                    Sản Phẩm Của Chúng Tôi
                  </h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center">
                      <li className="breadcrumb-item">
                        <NavLink to="/">Trang Chủ</NavLink>
                      </li>
                      <li className="breadcrumb-item active text-white">
                        Sản phẩm
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          <div className="container-xxl py-4 mt-1 py-sm-5">
            <div className="container">
              <h2 className="mb-4 text-center">Tất cả sản phẩm</h2>
              <div className="row mb-4">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-8 d-flex justify-content-end">
                  <select
                    className="form-select w-auto"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="">Sắp xếp</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A đến Z</option>
                    <option value="name-desc">Tên: Z đến A</option>
                  </select>
                </div>
              </div>
              <div className="row row-cols-1 row-cols-md-3 g-4">
                {products.map((product) => (
                  <ClothingCard key={product.productId} {...product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
