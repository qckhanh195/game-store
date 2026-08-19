import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gameApi } from '../services/api';
import { useCart } from '../hooks/useCart';
import { getSimilarGames } from '../hooks/useRecommendations';
import BlurText from '../components/BlurText';
import GameCard from '../components/GameCard';
import {
  ArrowLeft, ShoppingCart, Calendar, User, Building,
  Layers, Star, Loader2, Check, HelpCircle, Sparkles, Tag, Grid3X3,
  Monitor, Apple, Terminal, Trophy, ThumbsUp, ThumbsDown,
  Users, Clock, Mic, BarChart
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

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Miễn phí';
    return `$${price.toFixed(2)}`;
  };

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
          setActiveImage(g.screenshots?.length > 0 ? g.screenshots[0] : g.header_image);
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

  const isInCart = cartItems.some((item) => item._id === game._id);
  const isPurchased = purchasedGames.some((g) => g._id === game._id);

  const handleTagClick = (tag) => navigate(`/danh-muc?tag=${encodeURIComponent(tag)}`);
  const handleCategoryClick = (cat) => navigate(`/danh-muc?category=${encodeURIComponent(cat)}`);
  const handleDeveloperClick = (dev) => navigate(`/danh-muc?developer=${encodeURIComponent(dev)}`);

  const developerDisplay = game.developers?.join(', ') || 'N/A';
  const publisherDisplay = game.publishers?.join(', ') || 'N/A';
  const totalReviews = (game.positive || 0) + (game.negative || 0);
  const reviewPercent = totalReviews > 0 ? Math.round((game.positive / totalReviews) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      {/* Blurred banner */}
      <div className="absolute top-0 left-0 w-full h-80 overflow-hidden -z-10 select-none pointer-events-none opacity-15">
        <img src={game.header_image} alt="" className="w-full h-full object-cover filter blur-[80px]" />
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
                  {game.discount > 0 && (
                    <span className="text-xs font-display text-[#4ADE80] border border-[#4ADE80]/30 px-2 py-1">
                      -{game.discount}%
                    </span>
                  )}
                </div>

                <div className="font-display text-2xl md:text-3xl font-bold text-[#F0EDE6] leading-tight mb-3">
                  <BlurText text={game.name} delay={150} animateBy="words" direction="top" className="text-[#F0EDE6]" />
                </div>

                {/* Score */}
                {game.user_score > 0 && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-4 h-4 text-[#FFB830] fill-[#FFB830]" />
                    <span className="font-display text-sm font-bold text-[#FFB830]">
                      {game.user_score}
                    </span>
                    <span className="text-xs text-[#4A6180]">/ điểm người dùng</span>
                  </div>
                )}

                {/* Reviews */}
                {totalReviews > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#4ADE80]" />
                      <span className="text-xs text-[#4ADE80] font-display">{game.positive?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-3.5 h-3.5 text-[#F87171]" />
                      <span className="text-xs text-[#F87171] font-display">{game.negative?.toLocaleString()}</span>
                    </div>
                    <span className="text-[10px] text-[#4A6180] font-display">({reviewPercent}% tích cực)</span>
                  </div>
                )}

                {/* Metacritic */}
                {game.metacritic_score > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center justify-center w-8 h-8 font-display font-bold text-sm border
                      ${game.metacritic_score >= 75 ? 'border-[#4ADE80] text-[#4ADE80]' :
                        game.metacritic_score >= 50 ? 'border-[#FFB830] text-[#FFB830]' :
                        'border-[#F87171] text-[#F87171]'}`}>
                      {game.metacritic_score}
                    </span>
                    <span className="text-xs text-[#4A6180]">Metacritic</span>
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
                      {game.developers && game.developers.length > 0 ? (
                        game.developers.map((dev, i) => (
                          <span key={dev}>
                            <button
                              onClick={() => handleDeveloperClick(dev)}
                              className="text-[#38BDF8] hover:text-[#FF6B4A] transition-colors font-medium link-underline"
                            >
                              {dev}
                            </button>
                            {i < game.developers.length - 1 && ', '}
                          </span>
                        ))
                      ) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-[#4A6180] shrink-0 mt-0.5" />
                    <span>Phát hành: <strong className="text-[#F0EDE6]">{publisherDisplay}</strong></span>
                  </div>
                  {/* Platform support */}
                  <div className="flex items-center gap-3">
                    {game.windows && <Monitor className="w-4 h-4 text-[#38BDF8]" title="Windows" />}
                    {game.mac && <Apple className="w-4 h-4 text-[#8B9DB5]" title="macOS" />}
                    {game.linux && <Terminal className="w-4 h-4 text-[#FFB830]" title="Linux" />}
                  </div>
                  {/* Achievements */}
                  {game.achievements > 0 && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-4 h-4 text-[#FFB830] shrink-0 mt-0.5" />
                      <span>{game.achievements} thành tựu</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price + Action */}
              <div className="border-t border-[#253549] pt-4">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs text-[#4A6180] font-display tracking-wide">GIÁ BÁN</span>
                  <span className="font-display text-2xl font-bold text-[#FFB830]">
                    {formatPrice(game.price)}
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
                    onClick={() => addToCart(game)}
                    className="w-full py-3 bg-[#FF6B4A] text-[#0F1923] font-display font-bold
                               text-sm tracking-widest flex items-center justify-center gap-2
                               hover:bg-[#FF6B4A]/90 transition-colors cursor-pointer"
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
                dangerouslySetInnerHTML={{ __html: game.about_the_game || game.detailed_description || game.short_description || 'Chưa có mô tả.' }}
              />
            </div>

            {game.supported_languages && game.supported_languages.length > 0 && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h2 className="font-display text-xl font-semibold text-[#F0EDE6] mb-4 flex items-center gap-3">
                  <span className="text-[#FFB830] font-display text-sm tracking-widest">//</span>
                  Ngôn ngữ hỗ trợ
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.supported_languages.map((lang) => (
                    <span key={lang} className="text-xs font-display border border-[#253549] text-[#8B9DB5] px-2.5 py-1">
                      {lang}
                    </span>
                  ))}
                </div>

                {game.full_audio_languages && game.full_audio_languages.length > 0 && (
                  <>
                    <h3 className="font-display text-sm font-semibold text-[#F0EDE6] mb-3 flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#38BDF8]" />
                      Âm thanh lồng tiếng
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.full_audio_languages.map((lang) => (
                        <span key={`audio-${lang}`} className="text-xs font-display border border-[#38BDF8]/30 bg-[#38BDF8]/5 text-[#38BDF8] px-2.5 py-1">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Extra Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#253549] bg-[#162232] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-[#4ADE80]" />
                  <span className="font-display text-sm tracking-widest text-[#8B9DB5]">ƯỚC TÍNH SỞ HỮU</span>
                </div>
                <p className="font-display text-xl font-bold text-[#F0EDE6]">
                  {game.estimated_owners || 'N/A'}
                </p>
              </div>
              <div className="border border-[#253549] bg-[#162232] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="w-4 h-4 text-[#FFB830]" />
                  <span className="font-display text-sm tracking-widest text-[#8B9DB5]">NGƯỜI CHƠI CÙNG LÚC CAO NHẤT</span>
                </div>
                <p className="font-display text-xl font-bold text-[#F0EDE6]">
                  {game.peak_ccu ? game.peak_ccu.toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="border border-[#253549] bg-[#162232] p-5 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#FF6B4A]" />
                  <span className="font-display text-sm tracking-widest text-[#8B9DB5]">THỜI GIAN CHƠI TRUNG BÌNH</span>
                </div>
                <p className="font-display text-xl font-bold text-[#F0EDE6]">
                  {game.average_playtime_forever ? `${Math.round(game.average_playtime_forever / 60)} giờ` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Tags + Categories + Genres + Developer */}
          <div className="lg:col-span-1 space-y-6">
            {/* Genres */}
            {game.genres && game.genres.length > 0 && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h3 className="font-display text-base font-semibold text-[#F0EDE6] mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  Thể loại
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((g) => (
                    <button
                      key={g}
                      onClick={() => navigate(`/danh-muc?genre=${encodeURIComponent(g)}`)}
                      className="text-xs font-display tracking-wide border border-[#253549]
                                 text-[#8B9DB5] px-2.5 py-1 transition-all
                                 hover:border-[#38BDF8] hover:text-[#38BDF8] hover:bg-[#38BDF8]/5
                                 cursor-pointer"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
            {game.developers && game.developers.length > 0 && (
              <div className="border border-[#253549] bg-[#162232] p-6">
                <h3 className="font-display text-base font-semibold text-[#F0EDE6] mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#38BDF8]" />
                  Nhà phát triển
                </h3>
                {game.developers.map((dev) => (
                  <button
                    key={dev}
                    onClick={() => handleDeveloperClick(dev)}
                    className="font-display text-sm text-[#38BDF8] hover:text-[#FF6B4A] transition-colors link-underline block mb-1"
                  >
                    {dev}
                  </button>
                ))}
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
                <GameCard key={g._id} game={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
