import React, { useState } from "react";
import { toast } from "react-toastify";

const ClothingCard = ({
  title,
  description,
  unitPrice,
  image,
  discount = 0,
  stock,
  onAddToCart,
  productId,
}) => {
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = unitPrice - (unitPrice * discount) / 100;

  const handleAddToCart = () => {
    if (stock === 0) {
      toast.error("Sản phẩm đã hết hàng!", {
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
      quantity,
      image,
    };

    onAddToCart(item);
    toast.success("Đã thêm vào giỏ hàng!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={image}
          className="card-img-top object-fit-contain"
          height="300px"
          alt={title}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-truncate mb-3">{description}</p>

          {/* Giá sản phẩm */}
          <div className="mt-auto">
            {discount > 0 ? (
              <div className="d-flex align-items-center">
                <h6 className="text-danger me-2 mb-0">
                  {discountedPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </h6>
                <small className="text-muted mb-0">
                  <s>
                    {unitPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </s>
                </small>
              </div>
            ) : (
              <h6 className="text-primary mb-0">
                {unitPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h6>
            )}
          </div>

          {/* Điều chỉnh số lượng */}
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="mx-3">{quantity}</span>
            <button
              className="btn btn-outline-secondary"
              onClick={() => setQuantity((prev) => Math.min(stock, prev + 1))}
              disabled={quantity >= stock}
            >
              +
            </button>
            <span className="ms-3 text-muted">Còn lại: {stock}</span>
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

export default ClothingCard;
