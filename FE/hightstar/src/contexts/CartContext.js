// src/contexts/CartContext.js
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng
  const initialCartItems = JSON.parse(localStorage.getItem("shoppingCartItems")) || [];
  const [cartItems, setCartItems] = useState(initialCartItems);

  // Cập nhật localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    localStorage.setItem("shoppingCartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingItem = prevCart.find(
        (item) => item.product.productId === product.productId && item.type === product.type
      );

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        return prevCart.map((item) =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        const newItem = {
          cartItemId: new Date().getTime(), // Unique ID cho cart item
          ...product,
          quantity: 1, // Khởi tạo số lượng là 1
        };
        return [...prevCart, newItem];
      }
    });
  };

  // Hàm xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = (itemId) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.cartItemId !== itemId));
  };

  // Hàm cập nhật số lượng sản phẩm
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Hàm làm trống giỏ hàng
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
