import { useContext } from 'react';
import { CartContext } from '../context/CartContext'; // Import từ file bước 1

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart phải được đặt bên trong thẻ bọc CartProvider');
  }
  return context;
};