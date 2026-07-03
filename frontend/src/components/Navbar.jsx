import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Gamepad2, Home, Sparkles, Grid3X3, Package, ShoppingCart } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Trang chủ', icon: Home, exact: true },
  { to: '/goi-y', label: 'Gợi ý', icon: Sparkles },
  { to: '/danh-muc', label: 'Danh mục', icon: Grid3X3 },
  { to: '/da-mua', label: 'Đã mua', icon: Package },
];

export default function Navbar() {
  const { cartItems } = useCart();
  const location = useLocation();

  const isActive = (tab) => {
    if (tab.exact) return location.pathname === tab.to;
    return location.pathname.startsWith(tab.to);
  };

  return (
    <nav className="bg-[#162232] border-b border-[#253549] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-lg tracking-widest text-[#FF6B4A] shrink-0"
          >
            <Gamepad2 className="w-6 h-6" />
            GAMESTORE
          </Link>

          {/* Tab navigation */}
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isActive(tab);
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-display tracking-wide
                              transition-all duration-200 border-b-2
                              ${active
                                ? 'text-[#FF6B4A] border-[#FF6B4A]'
                                : 'text-[#8B9DB5] border-transparent hover:text-[#F0EDE6] hover:border-[#253549]'
                              }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Cart icon */}
          <Link
            to="/cart"
            className="relative p-2 border border-[#253549] text-[#8B9DB5]
                       hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF6B4A] text-[#0F1923]
                               text-[10px] font-bold rounded-full w-4 h-4
                               flex items-center justify-center animate-bounce-once">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}