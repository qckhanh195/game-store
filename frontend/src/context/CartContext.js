import { createContext } from 'react';

export const CartContext = createContext({
  cartItems: [],
  purchasedGames: [],
  profileGames: [],
  profileExcluded: new Set(),
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  addToPurchased: () => {},
  toggleProfileExclude: () => {},
  resetPurchased: () => {},
});