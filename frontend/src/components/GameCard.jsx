import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingCart, Check } from 'lucide-react';

export default function GameCard({ game }) {
  const { addToCart, cartItems, purchasedGames } = useCart();
  const navigate = useNavigate();

  const isInCart = cartItems.some((item) => item.id === game.id);
  const isPurchased = purchasedGames.some((g) => g.id === game.id);

  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/danh-muc?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <Link
      to={`/game/${game.id}`}
      className="group relative block border border-[#253549] bg-[#162232]
                 transition-all duration-300
                 hover:-translate-y-1 hover:border-[#FF6B4A] hover:bg-[#1E2F42]
                 hover:shadow-lg hover:shadow-[#FF6B4A]/5"
    >
      {/* Purchased badge */}
      {isPurchased && (
        <div className="absolute top-3 right-3 z-10 bg-[#4ADE80] text-[#0F1923]
                        font-display font-bold text-[10px] tracking-widest px-2 py-1">
          ĐÃ MUA
        </div>
      )}

      {/* Cover image */}
      <div className="aspect-video overflow-hidden border-b border-[#253549] bg-[#1E2F42]">
        <img
          src={game.header_img}
          alt={game.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = '/fallback-cover.png'; }}
        />
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-semibold text-[#F0EDE6]
                       group-hover:text-[#FF6B4A] transition-colors truncate mb-2">
          {game.name}
        </h3>

        {/* Tags */}
        {game.tags && game.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.tags.slice(0, 2).map((t) => (
              <button
                key={t}
                onClick={(e) => handleTagClick(e, t)}
                className="text-[10px] font-display tracking-wide border border-[#253549]
                           text-[#8B9DB5] px-2 py-0.5 transition-colors
                           hover:border-[#FF6B4A] hover:text-[#FF6B4A] cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#253549]">
          <span className="font-display text-base font-bold text-[#FFB830]">
            {game.price_raw === 0 ? 'Miễn phí' : game.price}
          </span>

          {isPurchased ? (
            <span className="flex items-center gap-1 text-[10px] font-display text-[#4ADE80] border border-[#4ADE80]/30 px-2 py-1">
              <Check className="w-3 h-3" />
              Đã mua
            </span>
          ) : isInCart ? (
            <Link
              to="/cart"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-display text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-1 hover:bg-[#38BDF8]/10 transition-colors"
            >
              <ShoppingCart className="w-3 h-3" />
              Trong giỏ
            </Link>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(game); }}
              className="flex items-center gap-1 text-[10px] font-display tracking-wide
                         bg-[#FF6B4A] text-[#0F1923] font-bold px-3 py-1
                         hover:bg-[#FF6B4A]/90 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-3 h-3" />
              Thêm
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}