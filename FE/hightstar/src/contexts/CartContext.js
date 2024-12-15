import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [shoppingCartItems, setShoppingCartItems] = useState([]);

  useEffect(() => {
    if (user && user.userId) {
      const storedCart =
        JSON.parse(localStorage.getItem(`shoppingCartItems_${user.userId}`)) ||
        [];
      setShoppingCartItems(storedCart);
    } else {
      setShoppingCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.userId) {
      localStorage.setItem(
        `shoppingCartItems_${user.userId}`,
        JSON.stringify(shoppingCartItems)
      );
    }
  }, [shoppingCartItems, user]);

  const addToCart = (item) => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const existingItemIndex = shoppingCartItems.findIndex(
      (cartItem) =>
        cartItem.product.productId === item.productId &&
        cartItem.size === item.selectedSize
    );

    let updatedCartItems = [];

    if (existingItemIndex !== -1) {
      const existingItem = shoppingCartItems[existingItemIndex];
      const newQuantity = existingItem.quantity + item.quantity;

      if (newQuantity > item.stock) {
        toast.error(`Số lượng tối đa cho sản phẩm này là ${item.stock}.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

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
      if (item.quantity > item.stock) {
        toast.error(`Số lượng tối đa cho sản phẩm này là ${item.stock}.`, {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const cartItem = {
        cartItemId: new Date().getTime(),
        product: {
          productId: item.productId,
          name: item.title,
          image: item.image || "",
        },
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        size: item.selectedSize || null,
      };
      updatedCartItems = [...shoppingCartItems, cartItem];
    }

    setShoppingCartItems(updatedCartItems);
    toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const removeFromCart = (itemId) => {
    const updatedItems = shoppingCartItems.filter(
      (item) => item.cartItemId !== itemId
    );
    setShoppingCartItems(updatedItems);
  };

  const updateQuantity = (itemId, newQuantity) => {
    const updatedItems = shoppingCartItems.map((item) => {
      if (item.cartItemId === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setShoppingCartItems(updatedItems);
  };

  const clearCart = () => {
    setShoppingCartItems([]);
    toast.info("Giỏ hàng đã được làm trống.", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <CartContext.Provider
      value={{
        shoppingCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setShoppingCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
