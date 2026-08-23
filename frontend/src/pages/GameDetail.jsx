import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gameApi } from '../services/api';
import { useCart } from '../hooks/useCart';
import { getSimilarGames } from '../hooks/useRecommendations';
import GameCard from '../components/GameCard';
import {
  ArrowLeft, ShoppingCart, Calendar, User, Building,
  Layers, Star, Loader2, Check, HelpCircle, Sparkles, Tag, Grid3X3,
} from 'lucide-react';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cartItems, addToCart, purchasedGames } = useCart();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [similarGames, setSimilarGames] = useState([]);
  const [allGames, setAllGames] = useState([]);

  // Fetch game detail
  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await gameApi.getGameDetail(id);
        if (data.success) {
          const g = data.data;
          setGame(g);
          setActiveImage(g.screenshots?.length > 0 ? g.screenshots[0] : g.header_img);
        } else {
          setError('Không tìm thấy thông tin trò chơi.');
        }
      } catch {
        setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchGameDetail();
  }, [id]);

  // Fetch all games for recommendation engine (lấy 100 game mẫu)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await gameApi.getGames({ limit: 100, page: 1 });
        if (data.success) setAllGames(data.data);
      } catch { /* ignore */ }
    };
    fetchAll();
  }, []);

  // Compute similar games whenever game or allGames changes
  useEffect(() => {
    if (game && allGames.length > 0) {
      setSimilarGames(getSimilarGames(game, allGames, 8));
    }
  }, [game, allGames]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#FF6B4A] animate-spin" />
        <p className="font-display text-sm tracking-widest text-[#8B9DB5]">ĐANG TẢI...</p>
      </div>
    );
  }

  // ── Error ──
  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex flex-col items-center justify-center px-6 text-center">
        <HelpCircle className="w-14 h-14 text-[#F87171] mb-4" />
        <h2 className="font-display text-2xl font-bold text-[#F0EDE6] mb-2">Đã xảy ra lỗi</h2>
        <p className="text-[#8B9DB5] mb-6">{error || 'Không tìm thấy trò chơi.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 border border-[#253549] px-5 py-2.5
                     text-sm text-[#8B9DB5] font-display hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
      </div>
    );
  }

  const isInCart = cartItems.some((item) => item.id === game.id);
  const isPurchased = purchasedGames.some((g) => g.id === game.id);

  const handleTagClick = (tag) => navigate(`/danh-muc?tag=${encodeURIComponent(tag)}`);
  const handleCategoryClick = (cat) => navigate(`/danh-muc?category=${encodeURIComponent(cat)}`);
  const handleDeveloperClick = (dev) => navigate(`/danh-muc?developer=${encodeURIComponent(dev)}`);

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Blurred banner */}
      <div className="absolute top-0 left-0 w-full h-80 overflow-hidden -z-10 select-none pointer-events-none opacity-15">
        <img src={game.header_img} alt="" className="w-full h-full object-cover filter blur-[80px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1923] via-[#0F1923]/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#8B9DB5] hover:text-[#FF6B4A] font-display text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại cửa hàng
        </Link>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10 animate-fade-up">
          {/* Left: Media */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main image */}
            <div className="aspect-video overflow-hidden border border-[#253549] bg-[#1E2F42]">
              <img
                src={activeImage}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {game.screenshots.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(src)}
                    className={`w-24 md:w-28 aspect-video overflow-hidden shrink-0 border transition-all
                      ${activeImage === src
                        ? 'border-[#FF6B4A]'
                        : 'border-[#253549] hover:border-[#8B9DB5]'
                      }`}
                  >
                    <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Purchase card */}
          <div className="lg:col-span-1">
            <div className="border border-[#253549] bg-[#162232] p-6 h-full flex flex-col justify-between min-h-80">
              <div>
                {/* Status */}
                <div className="flex items-center gap-2 mb-4">
                  {isPurchased ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-display tracking-widest
                                     bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-3 py-1">
                      <Check className="w-3 h-3" />
                      ĐÃ MUA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-display tracking-widest
                                     bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20 px-3 py-1">
                      <Sparkles className="w-3 h-3" />
                      NỔI BẬT
                    </span>
                  )}
                  {game.stock === 0 && (
                    <span className="text-xs font-display text-[#F87171] border border-[#F87171]/30 px-2 py-1">
                      HẾT HÀNG
                    </span>
                  )}
                </div>

                <h1 className="font-display text-2xl md:text-3xl font-bold text-[#F0EDE6] leading-tight mb-3">
                  {game.name}
                </h1>

                {/* Score */}
                {game.user_score && (
                  <div className="flex items-center gap-1.5 mb-6">
                    <Star className="w-4 h-4 text-[#FFB830] fill-[#FFB830]" />
                    <span className="font-display text-sm font-bold text-[#FFB830]">
                      {game.user_score}
                    </span>
                    <span className="text-xs text-[#4A6180]">/ điểm người dùng</span>
                  </div>
                )}

                {/* Metadata */}
                <div className="space-y-3 text-sm text-[#8B9DB5] border-t border-[#253549] pt-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-[#4A6180] shrink-0 mt-0.5" />
                    <span>Ngày ra mắt: <strong className="text-[#F0EDE6]">{game.release_date || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-[#4A6180] shrink-0 mt-0.5" />
                    <span>
                      Phát triển:{' '}
                      <button
                        onClick={() => handleDeveloperClick(game.developer)}
                        className="text-[#38BDF8] hover:text-[#FF6B4A] transition-colors font-medium link-underline"
                      >
                        {game.developer || 'N/A'}
                      </button>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-[#4A6180] shrink-0 mt-0.5" />
                    <span>Phát hành: <strong className="text-[#F0EDE6]">{game.publisher || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Price + Action */}
              <div className="border-t border-[#253549] pt-4">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs text-[#4A6180] font-display tracking-wide">GIÁ BÁN</span>
                  <span className="font-display text-2xl font-bold text-[#FFB830]">
                    {game.price_raw === 0 ? 'Miễn phí' : game.price}
                  </span>
                </div>

                {isPurchased ? (
                  <Link
                    to="/da-mua"
                    className="w-full py-3 border border-[#4ADE80] text-[#4ADE80] font-display font-bold
                               text-sm tracking-widest flex items-center justify-center gap-2
                               hover:bg-[#4ADE80]/10 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    XEM GAME ĐÃ MUA
                  </Link>
                ) : isInCart ? (
                  <Link
                    to="/cart"
                    className="w-full py-3 border border-[#38BDF8] text-[#38BDF8] font-display font-bold
                               text-sm tracking-widest flex items-center justify-center gap-2
                               hover:bg-[#38BDF8]/10 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    XEM GIỎ HÀNG
                  </Link>
                ) : (
                  <button
                    disabled={game.stock === 0}
                    onClick={() => addToCart(game)}
                    className="w-full py-3 bg-[#FF6B4A] text-[#0F1923] font-display font-bold
                               text-sm tracking-widest flex items-center justify-center gap-2
                               hover:bg-[#FF6B4A]/90 disabled:opacity-30 disabled:cursor-not-allowed
                               transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    THÊM VÀO GIỎ HÀNG
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body: About + Tags */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up animate-delay-2">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#253549] bg-[#162232] p-6">
              <h2 className="font-display text-xl font-semibold text-[#F0EDE6] mb-4 flex items-center gap-3">
                <span className="text-[#FF6B4A] font-display text-sm tracking-widest">//</span>
                Giới thiệu trò chơi
              </h2>
              <div
                className="game-description"
                dangerouslySetInnerHTML={{ __html: game.about || game.description || 'Chưa có mô tả.' }}
              />
            </div>

            {game.supported_languages && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h2 className="font-display text-xl font-semibold text-[#F0EDE6] mb-4 flex items-center gap-3">
                  <span className="text-[#FFB830] font-display text-sm tracking-widest">//</span>
                  Ngôn ngữ hỗ trợ
                </h2>
                <div
                  className="text-[#8B9DB5] text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: game.supported_languages }}
                />
              </div>
            )}
          </div>

          {/* Tags + Categories + Developer */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h3 className="font-display text-base font-semibold text-[#F0EDE6] mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF6B4A]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTagClick(t)}
                      className="text-xs font-display tracking-wide border border-[#253549]
                                 text-[#8B9DB5] px-2.5 py-1 transition-all
                                 hover:border-[#FF6B4A] hover:text-[#FF6B4A] hover:bg-[#FF6B4A]/5
                                 cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {game.categories && game.categories.length > 0 && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h3 className="font-display text-base font-semibold text-[#F0EDE6] mb-4 flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4 text-[#FFB830]" />
                  Danh mục
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleCategoryClick(c)}
                      className="text-xs font-display tracking-wide border border-[#253549]
                                 text-[#8B9DB5] px-2.5 py-1 transition-all
                                 hover:border-[#FFB830] hover:text-[#FFB830] hover:bg-[#FFB830]/5
                                 cursor-pointer"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Developer link */}
            {game.developer && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h3 className="font-display text-base font-semibold text-[#F0EDE6] mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#38BDF8]" />
                  Nhà phát triển
                </h3>
                <button
                  onClick={() => handleDeveloperClick(game.developer)}
                  className="font-display text-sm text-[#38BDF8] hover:text-[#FF6B4A] transition-colors link-underline"
                >
                  {game.developer}
                </button>
                <p className="text-xs text-[#4A6180] mt-1">
                  Xem tất cả game từ nhà phát triển này →
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Games Section */}
        {similarGames.length > 0 && (
          <div className="mt-14 animate-fade-up animate-delay-4">
            {/* Dot divider */}
            <div className="flex gap-1.5 mb-8">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full bg-[#253549]" />
              ))}
            </div>

            <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] mb-6 flex items-center gap-3">
              <span className="text-[#38BDF8] font-display text-sm tracking-widest">//</span>
              Game tương tự
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {similarGames.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
