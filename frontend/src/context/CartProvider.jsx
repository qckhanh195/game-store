import { useState } from 'react';
import { CartContext } from './CartContext';

// CHỈ export duy nhất một React Component này
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (game) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === game.id);
      if (exist) return prev; // Nếu game đã có trong giỏ, không thêm nữa
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};