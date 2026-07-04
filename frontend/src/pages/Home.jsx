import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../services/api';
import GameCard from '../components/GameCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SAMPLE_TAGS = ['Action', 'RPG', 'Strategy', 'Adventure', 'Simulation', 'Casual', 'Indie', 'Shooter'];

export default function Home() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await gameApi.getGames({ page, limit: 12, search, tag: activeTag });
        if (data.success) {
          setGames(data.data);
          setTotalPages(data.totalPages);
          setTotalGames(data.totalGames);
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách game:', error);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchGames, 350);
    return () => clearTimeout(delay);
  }, [page, search, activeTag]);

  const handleTagClick = (t) => {
    setActiveTag(t);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Hero Header */}
      <div className="border-b border-[#253549] bg-[#162232] px-6 py-10 animate-fade-up">
        <div className="max-w-7xl mx-auto">
          <p className="font-display text-sm tracking-widest text-[#FF6B4A] mb-2">
            // GAME STORE
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F0EDE6] mb-3 leading-tight">
            Khám phá <span className="text-[#FFB830]">thế giới game</span>
          </h1>
          <p className="text-[#8B9DB5] text-base max-w-lg">
            Hàng nghìn tựa game PC — từ indie độc lập đến AAA blockbuster.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up animate-delay-1">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6180]" />
            <input
              type="text"
              placeholder="Tìm kiếm game..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full border border-[#253549] bg-[#162232] pl-9 pr-4 py-2.5
                         text-sm text-[#F0EDE6] placeholder:text-[#4A6180]
                         transition-colors focus:border-[#FF6B4A] focus:outline-none"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6180] hover:text-[#FF6B4A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tag filter pills */}
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => handleTagClick('')}
              className={`px-3 py-1.5 text-xs font-display tracking-wide border transition-all
                ${activeTag === ''
                  ? 'bg-[#FF6B4A] text-[#0F1923] border-[#FF6B4A] font-bold'
                  : 'border-[#253549] text-[#8B9DB5] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
                }`}
            >
              Tất cả
            </button>
            {SAMPLE_TAGS.map((t) => (
              <button
                key={t}
                onClick={() => handleTagClick(t)}
                className={`px-3 py-1.5 text-xs font-display tracking-wide border transition-all
                  ${activeTag === t
                    ? 'bg-[#FF6B4A] text-[#0F1923] border-[#FF6B4A] font-bold'
                    : 'border-[#253549] text-[#8B9DB5] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-6 animate-fade-up animate-delay-2">
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] flex items-center gap-3">
            <span className="text-[#FF6B4A] font-display text-sm tracking-widest">//</span>
            {activeTag ? `Thể loại: ${activeTag}` : search ? `Kết quả: "${search}"` : 'Tất cả game'}
          </h2>
          <span className="text-xs text-[#4A6180] font-display">
            {totalGames.toLocaleString()} game
          </span>
        </div>

        {/* Game Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="border border-[#253549] bg-[#162232] animate-pulse-border"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-video bg-[#1E2F42]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#1E2F42] w-3/4" />
                  <div className="h-3 bg-[#1E2F42] w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : games.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-up animate-delay-3">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-[#253549]">
            <SlidersHorizontal className="w-12 h-12 text-[#4A6180] mx-auto mb-4" />
            <p className="font-display text-lg text-[#8B9DB5]">Không tìm thấy game phù hợp</p>
            <button
              onClick={() => { setSearch(''); setActiveTag(''); setPage(1); }}
              className="mt-4 text-sm text-[#FF6B4A] hover:underline font-display"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Dot divider */}
        {!loading && games.length > 0 && (
          <div className="flex gap-1.5 justify-center my-8">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-[#253549]" />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-4 animate-fade-up">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border border-[#253549] text-sm text-[#8B9DB5] font-display
                         disabled:opacity-30 hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
            >
              ← Trước
            </button>
            <span className="font-display text-sm text-[#4A6180]">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border border-[#253549] text-sm text-[#8B9DB5] font-display
                         disabled:opacity-30 hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
            >
              Tiếp →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}