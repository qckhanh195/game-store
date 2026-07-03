import { useState } from 'react';
import { CartContext } from './CartContext';

const PURCHASED_KEY = 'gamestore_purchased';

function loadPurchased() {
  try {
    const raw = localStorage.getItem(PURCHASED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePurchased(games) {
  try {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(games));
  } catch {
    // ignore storage errors
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedGames, setPurchasedGames] = useState(loadPurchased);

  const addToCart = (game) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === game.id);
      if (exist) return prev;
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Lưu danh sách game đã mua vào state + localStorage
  const addToPurchased = (items) => {
    setPurchasedGames((prev) => {
      const existing = new Set(prev.map((g) => g.id));
      const newItems = items.filter((g) => !existing.has(g.id));
      const updated = [...prev, ...newItems];
      savePurchased(updated);
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, purchasedGames, addToCart, removeFromCart, clearCart, addToPurchased }}
    >
      {children}
    </CartContext.Provider>
  );
};