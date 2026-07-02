import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Gamepad2 } from 'lucide-react';

export default function Navbar() {
  const { cartItems } = useCart();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo hướng về Trang chủ */}
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-blue-500 tracking-wider">
          <Gamepad2 className="w-7 h-7 text-blue-500" />
          GAMESTORE
        </Link>

        {/* Giỏ hàng */}
        <Link to="/cart" className="relative p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
          <ShoppingCart className="w-5 h-5 text-gray-200" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}