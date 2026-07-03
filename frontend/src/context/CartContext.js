import { createContext } from 'react';

export const CartContext = createContext({
  cartItems: [],
  purchasedGames: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  addToPurchased: () => {},
});