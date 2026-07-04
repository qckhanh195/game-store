import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gameApi } from '../services/api';
import { useCart } from '../hooks/useCart';
import { getPersonalizedRecommendations } from '../hooks/useRecommendations';

import GameCard from '../components/GameCard';
import { Sparkles, ShoppingBag, RefreshCw, Shuffle, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 12;

export default function Recommendations() {
  const { purchasedGames, profileGames, profileExcluded, toggleProfileExclude } = useCart();
  const [allGames, setAllGames] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recPage, setRecPage] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const data = await gameApi.getGames({ limit: 200, page: 1 });
        if (data.success) {
          const games = data.data;
          setAllGames(games);
          const shuffled = [...games].sort(() => Math.random() - 0.5);
          setTrendingGames(shuffled.slice(0, 8));
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Cập nhật gợi ý khi profileGames hoặc allGames thay đổi, reset trang về 1
  useEffect(() => {
    if (allGames.length === 0) return;
    if (profileGames.length > 0) {
      const recs = getPersonalizedRecommendations(profileGames, allGames, 80);
      setRecommended(recs);
    } else {
      setRecommended([]);
    }
    setRecPage(1);
  }, [profileGames, allGames]);

  const hasPurchased = purchasedGames.length > 0;
  const hasRecommendations = recommended.length > 0;
  const hasExcluded = profileExcluded.size > 0;

  // Phân trang
  const totalPages = Math.ceil(recommended.length / PAGE_SIZE);
  const pagedRecs = recommended.slice((recPage - 1) * PAGE_SIZE, recPage * PAGE_SIZE);

  const goToPage = (page) => {
    setRecPage(page);
    // Cuộn lên đầu section gợi ý
    document.getElementById('rec-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Header */}
      <div className="border-b border-[#253549] bg-[#162232] px-6 py-10 animate-fade-up">
        <div className="max-w-7xl mx-auto">
          <p className="font-display text-sm tracking-widest text-[#38BDF8] mb-2">// GỢI Ý</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F0EDE6] mb-3 leading-tight">
            Game <span className="text-[#FF6B4A]">dành cho bạn</span>
          </h1>
          <p className="text-[#8B9DB5] text-base max-w-lg">
            {hasPurchased
              ? `Dựa trên ${profileGames.length} game bạn đã mua — thuật toán Content-Based gợi ý theo thể loại, tags và nhà phát triển.`
              : 'Mua game đầu tiên để nhận gợi ý cá nhân hoá. Hiện đang hiển thị các game nổi bật.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="w-10 h-10 text-[#FF6B4A] animate-spin" />
            <p className="font-display text-sm tracking-widest text-[#8B9DB5]">Đang phân tích sở thích...</p>
          </div>
        ) : (
          <>
            {/* Personalized section */}
            {hasPurchased && (
              <section id="rec-section" className="mb-14 animate-fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] flex items-center gap-3">
                    <span className="text-[#FF6B4A] text-sm tracking-widest">//</span>
                    Gợi ý riêng cho bạn
                    <span className="text-xs font-display tracking-widest border border-[#FF6B4A]/30
                                     text-[#FF6B4A] bg-[#FF6B4A]/5 px-2 py-1">
                      AI
                    </span>
                  </h2>
                  {hasRecommendations && (
                    <span className="text-xs text-[#4A6180] font-display ml-auto">
                      {recommended.length} game · trang {recPage}/{totalPages}
                    </span>
                  )}
                </div>

                {/* Profile summary — "Dựa trên game đã mua" */}
                <div className="border border-[#253549] bg-[#162232] p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs text-[#8B9DB5]">
                      <Sparkles className="w-4 h-4 text-[#FFB830]" />
                      <span className="font-display tracking-wide">Dựa trên game đã mua:</span>
                    </div>
                    {hasExcluded && (
                      <button
                        onClick={() => {
                          [...profileExcluded].forEach((id) => toggleProfileExclude(id));
                        }}
                        className="flex items-center gap-1 text-[9px] font-display tracking-widest text-[#4A6180]
                                   border border-[#253549] px-2 py-1 hover:border-[#FFB830] hover:text-[#FFB830] transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Khôi phục tất cả ({profileExcluded.size})
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {purchasedGames.map((g) => {
                      const isExcluded = profileExcluded.has(g.id);
                      return (
                        <div
                          key={g.id}
                          className={`group/chip relative flex items-center gap-1.5 border px-2 py-1 transition-all duration-200
                            ${isExcluded
                              ? 'border-[#4A6180]/40 opacity-40 grayscale'
                              : 'border-[#253549] hover:border-[#FFB830]'
                            }`}
                        >
                          <Link to={`/game/${g.id}`} className="flex items-center gap-1.5">
                            <img src={g.header_img} alt={g.name} className="w-8 h-5 object-cover" />
                            <span className="text-[10px] font-display text-[#8B9DB5] truncate max-w-24">{g.name}</span>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleProfileExclude(g.id);
                            }}
                            title={isExcluded ? 'Khôi phục vào profile gợi ý' : 'Bỏ khỏi profile gợi ý'}
                            className={`ml-0.5 w-4 h-4 flex items-center justify-center rounded-full transition-all
                              ${isExcluded
                                ? 'bg-[#4A6180]/20 text-[#4A6180] hover:bg-[#FFB830]/20 hover:text-[#FFB830]'
                                : 'bg-transparent text-[#4A6180] opacity-0 group-hover/chip:opacity-100 hover:bg-[#F87171]/20 hover:text-[#F87171]'
                              }`}
                          >
                            {isExcluded ? (
                              <RotateCcw className="w-2.5 h-2.5" />
                            ) : (
                              <X className="w-2.5 h-2.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {profileGames.length === 0 && (
                    <p className="text-[11px] text-[#F87171] font-display mt-3">
                      ⚠ Bạn đã bỏ chọn toàn bộ game — gợi ý tạm thời không khả dụng. Hãy khôi phục ít nhất 1 game.
                    </p>
                  )}
                </div>

                {/* Game grid (paginated) */}
                {hasRecommendations ? (
                  <>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {pagedRecs.map((game, i) => (
                        <div
                          key={game.id}
                          className="animate-fade-up"
                          style={{ animationDelay: `${i * 40}ms` }}
                        >
                          <GameCard game={game} />
                        </div>
                      ))}
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-10">
                        {/* Prev */}
                        <button
                          onClick={() => goToPage(recPage - 1)}
                          disabled={recPage === 1}
                          className="flex items-center gap-1.5 px-3 py-2 border border-[#253549] font-display text-xs text-[#8B9DB5]
                                     hover:border-[#FF6B4A] hover:text-[#FF6B4A] disabled:opacity-30 disabled:cursor-not-allowed
                                     transition-all"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                        </button>

                        {/* Page numbers */}
                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Hiển thị trang đầu, cuối, và lân cận trang hiện tại
                            const isNear = Math.abs(page - recPage) <= 1;
                            const isEdge = page === 1 || page === totalPages;
                            if (!isNear && !isEdge) {
                              // dấu "..." giữa
                              if (page === 2 || page === totalPages - 1) {
                                return (
                                  <span key={page} className="px-2 py-2 text-[#4A6180] font-display text-xs self-end">
                                    …
                                  </span>
                                );
                              }
                              return null;
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-9 h-9 border font-display text-xs transition-all
                                  ${recPage === page
                                    ? 'border-[#FF6B4A] bg-[#FF6B4A]/10 text-[#FF6B4A]'
                                    : 'border-[#253549] text-[#8B9DB5] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
                                  }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>

                        {/* Next */}
                        <button
                          onClick={() => goToPage(recPage + 1)}
                          disabled={recPage === totalPages}
                          className="flex items-center gap-1.5 px-3 py-2 border border-[#253549] font-display text-xs text-[#8B9DB5]
                                     hover:border-[#FF6B4A] hover:text-[#FF6B4A] disabled:opacity-30 disabled:cursor-not-allowed
                                     transition-all"
                        >
                          Tiếp
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  profileGames.length > 0 && (
                    <div className="border border-[#253549] bg-[#162232] p-8 text-center">
                      <p className="text-[#8B9DB5] font-display text-sm">Không tìm thấy game gợi ý phù hợp.</p>
                    </div>
                  )
                )}
              </section>
            )}

            {/* No purchase prompt */}
            {!hasPurchased && (
              <div className="border border-[#FFB830]/20 bg-[#FFB830]/5 p-8 mb-12 text-center animate-fade-up">
                <ShoppingBag className="w-12 h-12 text-[#FFB830] mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold text-[#F0EDE6] mb-2">
                  Chưa có dữ liệu cá nhân hoá
                </h3>
                <p className="text-[#8B9DB5] text-sm max-w-md mx-auto mb-6">
                  Mua ít nhất 1 game để thuật toán Content-Based học sở thích của bạn và đưa ra gợi ý phù hợp.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-[#FFB830] text-[#0F1923]
                             font-display font-bold text-sm tracking-wide px-6 py-3
                             hover:bg-[#FFB830]/90 transition-colors"
                >
                  Khám phá game ngay
                </Link>
              </div>
            )}

            {/* Trending / Discovery section */}
            <section className="animate-fade-up animate-delay-3">
              <div className="flex gap-1.5 mb-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-[#253549]" />
                ))}
              </div>

              <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] mb-6 flex items-center gap-3">
                <span className="text-[#FFB830] text-sm tracking-widest">//</span>
                Khám phá ngẫu nhiên
                <Shuffle className="w-5 h-5 text-[#4A6180] ml-1" />
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {trendingGames.map((game, i) => (
                  <div
                    key={game.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
