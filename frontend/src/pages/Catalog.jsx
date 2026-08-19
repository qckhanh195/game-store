import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gameApi } from '../services/api';
import GameCard from '../components/GameCard';
import BlurText from '../components/BlurText';
import { Tag, Grid3X3, User, X, SlidersHorizontal, Search, Sparkles } from 'lucide-react';

const POPULAR_TAGS = [
  'Action', 'RPG', 'Strategy', 'Adventure', 'Simulation',
  'Casual', 'Indie', 'Shooter', 'Horror', 'Puzzle',
  'Sports', 'Racing', 'Fighting', 'Platformer', 'Stealth',
];

const POPULAR_CATEGORIES = [
  'Single-player', 'Multi-player', 'Co-op', 'Online Co-op',
  'Steam Achievements', 'Full controller support', 'Steam Cloud',
  'Partial Controller Support', 'Cross-Platform Multiplayer',
];

const POPULAR_GENRES = [
  'Action', 'Adventure', 'RPG', 'Strategy', 'Simulation',
  'Sports', 'Racing', 'Indie', 'Casual', 'Free to Play',
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // Extract array of strings from comma-separated search params
  const getArrayParam = (key) => {
    const val = searchParams.get(key);
    return val ? val.split(',').filter(Boolean) : [];
  };

  const activeTags = getArrayParam('tag');
  const activeCategories = getArrayParam('category');
  const activeDeveloper = searchParams.get('developer') || '';
  const activeGenres = getArrayParam('genre');

  const hasFilter = activeTags.length > 0 || activeCategories.length > 0 || activeDeveloper || activeGenres.length > 0;

  // Helper to toggle a value in an array and update URL params
  const toggleParam = (key, value) => {
    const current = getArrayParam(key);
    let updated;
    if (current.includes(value)) {
      updated = current.filter(v => v !== value);
    } else {
      updated = [...current, value];
    }
    
    const newParams = new URLSearchParams(searchParams);
    if (updated.length > 0) {
      newParams.set(key, updated.join(','));
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  // Fetch games whenever filters change
  useEffect(() => {
    setPage(1);
  }, [searchParams]); // Depend on searchParams directly

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await gameApi.getGames({
          page,
          limit: 15,
          search,
          tag: searchParams.get('tag') || '',
          category: searchParams.get('category') || '',
          developer: activeDeveloper,
          genre: searchParams.get('genre') || '',
        });
        if (data.success) {
          setGames(data.data);
          setTotalPages(data.totalPages);
          setTotalGames(data.totalGames);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchGames, 300);
    return () => clearTimeout(delay);
  }, [page, search, searchParams, activeDeveloper]);

  const clearFilter = () => {
    setSearchParams({});
    setSearch('');
  };

  // Determine what filter type is active for styling
  const filterLabels = [];
  if (activeTags.length > 0) filterLabels.push(`Tags (${activeTags.length})`);
  if (activeCategories.length > 0) filterLabels.push(`Danh mục (${activeCategories.length})`);
  if (activeDeveloper) filterLabels.push(`Dev: ${activeDeveloper}`);
  if (activeGenres.length > 0) filterLabels.push(`Thể loại (${activeGenres.length})`);
  
  const filterLabelStr = filterLabels.join(' · ');

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Header */}
      <div className="border-b border-[#253549] bg-[#162232] px-6 py-8 relative overflow-hidden animate-fade-up">
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="font-display text-sm tracking-widest text-[#FFB830] mb-2">// DANH MỤC</p>
          <div className="font-display text-3xl md:text-4xl font-bold mb-1">
            <BlurText 
              text={filterLabelStr ? filterLabelStr : 'Khám phá theo thể loại'} 
              delay={100}
              animateBy="words"
              direction="top"
              className="text-[#F0EDE6]"
            />
          </div>
          {filterLabelStr && (
            <button
              onClick={clearFilter}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#F87171] border border-[#F87171]/30
                         px-3 py-1.5 hover:bg-[#F87171]/10 transition-colors font-display tracking-wide"
            >
              <X className="w-3.5 h-3.5" />
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6 animate-fade-up animate-delay-1">
          {/* Search */}
          <div>
            <p className="font-display text-xs tracking-widest text-[#4A6180] mb-3">TÌM KIẾM</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A6180]" />
              <input
                type="text"
                placeholder="Tên game..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full border border-[#253549] bg-[#162232] pl-9 pr-3 py-2.5
                           text-sm text-[#F0EDE6] placeholder:text-[#4A6180]
                           focus:border-[#FF6B4A] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <p className="font-display text-xs tracking-widest text-[#4A6180] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              THỂ LOẠI
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_GENRES.map((g) => {
                const isActive = activeGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleParam('genre', g)}
                    className={`text-xs font-display tracking-wide border px-2.5 py-1 transition-all
                      ${isActive
                        ? 'bg-[#38BDF8] border-[#38BDF8] text-[#0F1923] font-bold'
                        : 'border-[#253549] text-[#8B9DB5] hover:border-[#38BDF8] hover:text-[#38BDF8]'
                      }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="font-display text-xs tracking-widest text-[#4A6180] mb-3 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              TAGS PHỔ BIẾN
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TAGS.map((t) => {
                const isActive = activeTags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggleParam('tag', t)}
                    className={`text-xs font-display tracking-wide border px-2.5 py-1 transition-all
                      ${isActive
                        ? 'bg-[#FF6B4A] border-[#FF6B4A] text-[#0F1923] font-bold'
                        : 'border-[#253549] text-[#8B9DB5] hover:border-[#FF6B4A] hover:text-[#FF6B4A]'
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="font-display text-xs tracking-widest text-[#4A6180] mb-3 flex items-center gap-2">
              <Grid3X3 className="w-3.5 h-3.5" />
              DANH MỤC
            </p>
            <div className="space-y-1">
              {POPULAR_CATEGORIES.map((c) => {
                const isActive = activeCategories.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleParam('category', c)}
                    className={`w-full text-left text-xs font-display py-1.5 px-3 border transition-all
                      ${isActive
                        ? 'bg-[#FFB830]/10 border-[#FFB830] text-[#FFB830]'
                        : 'border-transparent text-[#8B9DB5] hover:border-[#253549] hover:text-[#F0EDE6]'
                      }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-3 animate-fade-up animate-delay-2">
          {/* Filter bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-wrap items-center gap-2">
              {hasFilter && filterLabels.map((lbl, idx) => (
                <div key={idx} className="flex items-center gap-2 border border-[#FF6B4A]/30 bg-[#FF6B4A]/5
                                text-[#FF6B4A] text-xs font-display px-3 py-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {lbl}
                </div>
              ))}
            </div>
            <span className="text-xs text-[#4A6180] font-display ml-auto shrink-0">
              {loading ? '...' : `${totalGames.toLocaleString()} game`}
            </span>
          </div>

          {/* Active developer badge */}
          {activeDeveloper && (
            <div className="mb-6 flex items-center gap-3 border border-[#38BDF8]/20 bg-[#38BDF8]/5 px-4 py-3">
              <User className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-sm text-[#38BDF8] font-display">
                Game của nhà phát triển: <strong>{activeDeveloper}</strong>
              </span>
              <button onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('developer');
                setSearchParams(newParams);
              }} className="ml-auto text-[#38BDF8] hover:text-[#F0EDE6]">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-[#253549] animate-pulse-border">
                  <div className="aspect-video bg-[#1E2F42]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[#1E2F42] w-3/4" />
                    <div className="h-3 bg-[#1E2F42] w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : games.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {games.map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          ) : (
            <div className="border border-[#253549] bg-[#162232] p-14 text-center">
              <SlidersHorizontal className="w-12 h-12 text-[#4A6180] mx-auto mb-4" />
              <p className="font-display text-lg text-[#8B9DB5]">Không tìm thấy kết quả</p>
              <button
                onClick={clearFilter}
                className="mt-4 text-sm text-[#FF6B4A] hover:underline font-display"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 border border-[#253549] text-sm text-[#8B9DB5] font-display
                           disabled:opacity-30 hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
              >
                ← Trước
              </button>
              <span className="font-display text-sm text-[#4A6180]">{page} / {totalPages}</span>
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
    </div>
  );
}
