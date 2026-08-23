import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Package, ArrowRight, Gamepad2, Calendar, User, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

export default function Purchased() {
  const { purchasedGames, resetPurchased } = useCart();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetPurchased();
      setShowConfirmModal(false);
    } catch (err) {
      console.error('Lỗi khi reset game đã mua:', err);
    } finally {
      setResetting(false);
    }
  };

  const formatPrice = (rawPrice) => {
    if (!rawPrice || rawPrice === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawPrice / 100);
  };

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Header */}
      <div className="border-b border-[#253549] bg-[#162232] px-6 py-10 animate-fade-up">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <p className="font-display text-sm tracking-widest text-[#4ADE80] mb-2">// ĐÃ MUA</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F0EDE6] mb-3 leading-tight">
              Game của <span className="text-[#4ADE80]">bạn</span>
            </h1>
            <p className="text-[#8B9DB5] text-base">
              {purchasedGames.length > 0
                ? `Bạn đang sở hữu ${purchasedGames.length} tựa game.`
                : 'Bạn chưa mua game nào.'}
            </p>
          </div>
          {purchasedGames.length > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="inline-flex items-center gap-2 border border-[#FF4655] text-[#FF4655]
                         font-display font-bold text-xs tracking-wider px-5 py-2.5
                         hover:bg-[#FF4655] hover:text-[#0F1923] transition-all cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-4 h-4" />
              RESET THƯ VIỆN
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {purchasedGames.length === 0 ? (
          /* Empty state */
          <div className="border border-[#253549] bg-[#162232] p-16 text-center animate-fade-up">
            <Package className="w-16 h-16 text-[#4A6180] mx-auto mb-5" />
            <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] mb-3">
              Thư viện trống
            </h2>
            <p className="text-[#8B9DB5] text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Bạn chưa mua tựa game nào. Hãy khám phá cửa hàng và thêm vào giỏ hàng để bắt đầu!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#FF6B4A] text-[#0F1923]
                         font-display font-bold text-sm tracking-wide px-8 py-3
                         hover:bg-[#FF6B4A]/90 transition-colors"
            >
              <Gamepad2 className="w-5 h-5" />
              Khám phá cửa hàng
            </Link>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 animate-fade-up">
              <div className="border border-[#253549] bg-[#162232] p-5">
                <p className="font-display text-xs tracking-widest text-[#4A6180] mb-1">TỔNG SỐ GAME</p>
                <p className="font-display text-3xl font-bold text-[#4ADE80]">{purchasedGames.length}</p>
              </div>
              <div className="border border-[#253549] bg-[#162232] p-5">
                <p className="font-display text-xs tracking-widest text-[#4A6180] mb-1">TỔNG CHI PHÍ</p>
                <p className="font-display text-3xl font-bold text-[#FFB830]">
                  {formatPrice(purchasedGames.reduce((s, g) => s + (g.price_raw || 0), 0))}
                </p>
              </div>
              <div className="border border-[#253549] bg-[#162232] p-5 col-span-2 md:col-span-1">
                <p className="font-display text-xs tracking-widest text-[#4A6180] mb-2">THỂ LOẠI NHIỀU NHẤT</p>
                {(() => {
                  const tagCount = {};
                  purchasedGames.forEach((g) =>
                    g.tags?.forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; })
                  );
                  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0];
                  return top ? (
                    <p className="font-display text-lg font-bold text-[#38BDF8]">{top[0]}</p>
                  ) : (
                    <p className="text-[#4A6180] text-sm">—</p>
                  );
                })()}
              </div>
            </div>

            {/* Section heading */}
            <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] mb-6 flex items-center gap-3 animate-fade-up animate-delay-2">
              <span className="text-[#4ADE80] text-sm tracking-widest">//</span>
              Thư viện của bạn
            </h2>

            {/* Game list */}
            <div className="space-y-3 animate-fade-up animate-delay-3">
              {purchasedGames.map((game, i) => (
                <div
                  key={game.id}
                  className="border border-[#253549] bg-[#162232] p-4 flex gap-5
                             hover:border-[#4ADE80]/30 hover:bg-[#1E2F42] transition-all group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Cover */}
                  <Link
                    to={`/game/${game.id}`}
                    className="w-32 md:w-44 aspect-video overflow-hidden shrink-0 border border-[#253549]"
                  >
                    <img
                      src={game.header_img}
                      alt={game.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.currentTarget.src = '/fallback-cover.png'; }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link to={`/game/${game.id}`}>
                          <h3 className="font-display text-lg font-semibold text-[#F0EDE6]
                                         hover:text-[#4ADE80] transition-colors line-clamp-1">
                            {game.name}
                          </h3>
                        </Link>
                        <span className="shrink-0 text-[10px] font-display tracking-widest
                                         bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-2 py-0.5">
                          ĐÃ MUA
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#8B9DB5] mt-1">
                        {game.developer && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-[#4A6180]" />
                            {game.developer}
                          </span>
                        )}
                        {game.release_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#4A6180]" />
                            {game.release_date}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {game.tags && game.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {game.tags.slice(0, 3).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-display border border-[#253549] text-[#4A6180] px-2 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#253549]">
                      <span className="font-display font-bold text-[#FFB830] text-sm">
                        {game.price_raw === 0 ? 'Miễn phí' : game.price}
                      </span>
                      <Link
                        to={`/game/${game.id}`}
                        className="flex items-center gap-1.5 text-xs font-display text-[#8B9DB5]
                                   hover:text-[#FF6B4A] transition-colors"
                      >
                        Xem chi tiết
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dot divider */}
            <div className="flex gap-1.5 justify-center my-10">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-[#253549]" />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/goi-y"
                className="inline-flex items-center gap-2 border border-[#FF6B4A] text-[#FF6B4A]
                           font-display text-sm tracking-wide px-8 py-3
                           hover:bg-[#FF6B4A] hover:text-[#0F1923] transition-all"
              >
                Xem gợi ý game tương tự
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 transition-all duration-300">
          <div className="border border-[#FF4655]/40 bg-[#162232] p-8 max-w-md w-full relative animate-fade-up">
            <div className="flex justify-center mb-5">
              <div className="border border-[#FF4655]/30 p-4 text-[#FF4655]">
                <AlertTriangle className="w-12 h-12" />
              </div>
            </div>
            <h3 className="font-display text-xl font-bold text-[#F0EDE6] mb-3 text-center tracking-wider">
              XÁC NHẬN RESET THƯ VIỆN?
            </h3>
            <p className="text-[#8B9DB5] text-sm leading-relaxed mb-8 text-center font-body">
              Hành động này sẽ xóa tất cả game đã mua khỏi tài khoản của bạn và hoàn trả lại số lượng tồn kho tương ứng trong cơ sở dữ liệu. Bạn không thể hoàn tác hành động này.
            </p>
            <div className="flex gap-4">
              <button
                disabled={resetting}
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 border border-[#253549] text-[#8B9DB5] font-display text-xs tracking-wider py-3 hover:bg-[#1E2F42] hover:text-[#F0EDE6] transition-colors cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                disabled={resetting}
                onClick={handleReset}
                className="flex-1 bg-[#FF4655] text-[#0F1923] font-display font-bold text-xs tracking-wider py-3 hover:bg-[#FF4655]/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {resetting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ĐANG RESET...
                  </>
                ) : (
                  'ĐỒNG Ý RESET'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
