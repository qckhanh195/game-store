import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingCart, Check, Building, Tag, Layers } from 'lucide-react';

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
      {/* Hover Overlay for recommended games */}
      {game.recommendationInfo && (
        <div className="absolute inset-0 bg-[#0F1923]/95 backdrop-blur-sm border border-[#FF6B4A]/40
                        opacity-0 group-hover:opacity-100 transition-all duration-300
                        flex flex-col justify-between p-4 z-20 pointer-events-auto shadow-[0_0_15px_rgba(255,107,74,0.15)]">
          <div>
            {/* Compatibility info */}
            {(() => {
              const score = game.recommendationInfo.score;
              const themeTextColor = score >= 80 ? 'text-[#4ADE80]' : score >= 70 ? 'text-[#38BDF8]' : 'text-[#FFB830]';
              const themeBarColor = score >= 80 ? 'bg-[#4ADE80]' : score >= 70 ? 'bg-[#38BDF8]' : 'bg-[#FFB830]';
              return (
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[9px] tracking-widest font-display text-[#8B9DB5] uppercase">// TƯƠNG THÍCH AI</span>
                    <span className={`font-display text-base font-bold ${themeTextColor}`}>{score}%</span>
                  </div>
                  <div className="w-full bg-[#1E2F42] h-1 rounded-full overflow-hidden">
                    <div className={`${themeBarColor} h-full rounded-full`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              );
            })()}

            {/* Similarities list */}
            <div className="space-y-3">
              <p className="text-[9px] tracking-widest font-display text-[#8B9DB5] uppercase border-b border-[#253549] pb-1">
                // ĐIỂM TƯƠNG ĐỒNG
              </p>
              <div className="space-y-2 text-xs">
                {/* Developer match */}
                {game.recommendationInfo.matches.developer && (
                  <div className="flex items-start gap-1.5 text-xs text-[#8B9DB5]">
                    <Building className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#4A6180] block font-display">NHÀ PHÁT TRIỂN</span>
                      <span className="text-[#38BDF8] font-medium text-[11px] truncate block max-w-[190px]">
                        {game.recommendationInfo.matches.developer}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tags matches */}
                {game.recommendationInfo.matches.tags && game.recommendationInfo.matches.tags.length > 0 && (
                  <div className="flex items-start gap-1.5 text-xs text-[#8B9DB5]">
                    <Tag className="w-3.5 h-3.5 text-[#FFB830] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#4A6180] block font-display">TAGS CHUNG</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {game.recommendationInfo.matches.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-display bg-[#1E2F42] border border-[#253549] text-[#F0EDE6] px-1.5 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                        {game.recommendationInfo.matches.tags.length > 3 && (
                          <span className="text-[9px] text-[#4A6180] font-display self-center ml-0.5">
                            +{game.recommendationInfo.matches.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories matches */}
                {game.recommendationInfo.matches.categories && game.recommendationInfo.matches.categories.length > 0 && (
                  <div className="flex items-start gap-1.5 text-xs text-[#8B9DB5]">
                    <Layers className="w-3.5 h-3.5 text-[#FF6B4A] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-[#4A6180] block font-display">DANH MỤC CHUNG</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {game.recommendationInfo.matches.categories.slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="text-[9px] font-display bg-[#1E2F42] border border-[#253549] text-[#F0EDE6] px-1.5 py-0.5"
                          >
                            {c}
                          </span>
                        ))}
                        {game.recommendationInfo.matches.categories.length > 3 && (
                          <span className="text-[9px] text-[#4A6180] font-display self-center ml-0.5">
                            +{game.recommendationInfo.matches.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Area (Duplicated for interaction) */}
          <div className="flex items-center justify-between pt-3 border-t border-[#253549]">
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(game);
                }}
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
      )}
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