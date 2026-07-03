import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../hooks/useCart';
import { getPersonalizedRecommendations } from '../hooks/useRecommendations';

import GameCard from '../components/GameCard';
import { Sparkles, ShoppingBag, RefreshCw, Shuffle } from 'lucide-react';

export default function Recommendations() {
  const { purchasedGames } = useCart();
  const [allGames, setAllGames] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Lấy nhiều game để có đủ ngữ liệu cho recommendation
        const res = await axios.get('http://localhost:5000/api/games', {
          params: { limit: 200, page: 1 },
        });
        if (res.data.success) {
          const games = res.data.data;
          setAllGames(games);

          // "Trending" — lấy ngẫu nhiên 8 game từ 30 game đầu
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

  // Cập nhật gợi ý khi purchasedGames hoặc allGames thay đổi
  useEffect(() => {
    if (allGames.length === 0) return;
    if (purchasedGames.length > 0) {
      setRecommended(getPersonalizedRecommendations(purchasedGames, allGames, 16));
    }
  }, [purchasedGames, allGames]);

  const hasPurchased = purchasedGames.length > 0;
  const hasRecommendations = recommended.length > 0;

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
              ? `Dựa trên ${purchasedGames.length} game bạn đã mua — thuật toán Content-Based gợi ý theo thể loại, tags và nhà phát triển.`
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
            {hasPurchased && hasRecommendations && (
              <section className="mb-14 animate-fade-up">
                <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] mb-6 flex items-center gap-3">
                  <span className="text-[#FF6B4A] text-sm tracking-widest">//</span>
                  Gợi ý riêng cho bạn
                  <span className="ml-2 text-xs font-display tracking-widest border border-[#FF6B4A]/30
                                   text-[#FF6B4A] bg-[#FF6B4A]/5 px-2 py-1">
                    AI
                  </span>
                </h2>

                {/* Profile summary */}
                <div className="border border-[#253549] bg-[#162232] p-5 mb-6 flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-xs text-[#8B9DB5]">
                    <Sparkles className="w-4 h-4 text-[#FFB830]" />
                    <span className="font-display tracking-wide">Dựa trên game đã mua:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {purchasedGames.slice(0, 4).map((g) => (
                      <Link
                        key={g.id}
                        to={`/game/${g.id}`}
                        className="flex items-center gap-1.5 border border-[#253549] px-2 py-1
                                   hover:border-[#FFB830] transition-colors"
                      >
                        <img
                          src={g.header_img}
                          alt={g.name}
                          className="w-8 h-5 object-cover"
                        />
                        <span className="text-[10px] font-display text-[#8B9DB5] truncate max-w-24">{g.name}</span>
                      </Link>
                    ))}
                    {purchasedGames.length > 4 && (
                      <span className="text-xs text-[#4A6180] font-display self-center">
                        +{purchasedGames.length - 4} khác
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {recommended.map((game, i) => (
                    <div
                      key={game.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <GameCard game={game} />
                    </div>
                  ))}
                </div>
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
              {/* Dot divider */}
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
