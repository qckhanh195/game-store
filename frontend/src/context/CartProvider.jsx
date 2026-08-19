import { useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { gameApi } from '../services/api';
import { useAuth } from './AuthContext';

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
  const { user, updateProfile, syncUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [purchasedGames, setPurchasedGames] = useState(loadPurchased);
  const [profileExcluded, setProfileExcluded] = useState(loadExcluded);

  // Đồng bộ hóa trạng thái game đã mua khi người dùng thay đổi hoặc đăng nhập
  useEffect(() => {
    if (user) {
      setPurchasedGames(user.purchasedGames || []);
      setProfileExcluded(new Set(user.excludedGames || []));
    } else {
      setPurchasedGames(loadPurchased());
      setProfileExcluded(loadExcluded());
    }
  }, [user]);

  const addToCart = (game) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item._id === game._id);
      if (exist) return prev;
      return [...prev, { ...game, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Lưu danh sách game đã mua vào state + localStorage / DB
  const addToPurchased = async (items) => {
    if (user) {
      await syncUser();
    } else {
      setPurchasedGames((prev) => {
        const existing = new Set(prev.map((g) => g._id));
        const newItems = items.filter((g) => !existing.has(g._id));
        const updated = [...prev, ...newItems];
        savePurchased(updated);
        return updated;
      });
    }
  };

  // Toggle game khỏi profile gợi ý (không xóa khỏi thư viện)
  const toggleProfileExclude = async (gameId) => {
    let nextExcluded;
    setProfileExcluded((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      nextExcluded = [...next];
      if (!user) {
        saveExcluded(next);
      }
      return next;
    });

    if (user) {
      try {
        await updateProfile({ excludedGames: nextExcluded });
      } catch (err) {
        console.error('Lỗi khi cập nhật danh sách loại trừ:', err);
      }
    }
  };

  // Reset toàn bộ danh sách game đã mua và khôi phục kho hàng backend
  const resetPurchased = async () => {
    try {
      const gameIds = purchasedGames.map((g) => g._id);
      if (gameIds.length > 0) {
        await gameApi.resetPurchases(gameIds);
      }
      if (user) {
        await syncUser();
      } else {
        setPurchasedGames([]);
        savePurchased([]);
        setProfileExcluded(new Set());
        saveExcluded(new Set());
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục kho hàng backend:', err);
    }
  };

  // Game dùng làm profile = đã mua nhưng chưa bị loại
  const profileGames = purchasedGames.filter((g) => !profileExcluded.has(g._id));

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