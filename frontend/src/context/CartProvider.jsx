import { useState } from 'react';
import { CartContext } from './CartContext';
import { gameApi } from '../services/api';

const PURCHASED_KEY = 'gamestore_purchased';
const EXCLUDED_KEY = 'gamestore_profile_excluded';

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

function loadExcluded() {
  try {
    const raw = localStorage.getItem(EXCLUDED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveExcluded(set) {
  try {
    localStorage.setItem(EXCLUDED_KEY, JSON.stringify([...set]));
  } catch {
    // ignore storage errors
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedGames, setPurchasedGames] = useState(loadPurchased);
  const [profileExcluded, setProfileExcluded] = useState(loadExcluded);

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

  // Toggle game khỏi profile gợi ý (không xóa khỏi thư viện)
  const toggleProfileExclude = (gameId) => {
    setProfileExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      saveExcluded(next);
      return next;
    });
  };

  // Reset toàn bộ danh sách game đã mua và khôi phục kho hàng backend
  const resetPurchased = async () => {
    try {
      const gameIds = purchasedGames.map((g) => g.id);
      if (gameIds.length > 0) {
        await gameApi.resetPurchases(gameIds);
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục kho hàng backend:', err);
    }
    setPurchasedGames([]);
    savePurchased([]);
    setProfileExcluded(new Set());
    saveExcluded(new Set());
  };

  // Game dùng làm profile = đã mua nhưng chưa bị loại
  const profileGames = purchasedGames.filter((g) => !profileExcluded.has(g.id));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        purchasedGames,
        profileGames,
        profileExcluded,
        addToCart,
        removeFromCart,
        clearCart,
        addToPurchased,
        toggleProfileExclude,
        resetPurchased,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};