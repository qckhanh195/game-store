import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, ShoppingCart, Calendar, User, Building, 
  Layers, Star, Loader2, Sparkles, Check, HelpCircle, Package, Bookmark
} from 'lucide-react';

export default function GameDetail() {
  const { id } = useParams();
  const { cartItems, addToCart } = useCart();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/games/${id}`);
        if (response.data.success) {
          setGame(response.data.data);
          // Set hình ảnh hiển thị chính mặc định là header_img hoặc ảnh screenshot đầu tiên
          if (response.data.data.screenshots && response.data.data.screenshots.length > 0) {
            setActiveImage(response.data.data.screenshots[0]);
          } else {
            setActiveImage(response.data.data.header_img);
          }
        } else {
          setError('Không tìm thấy thông tin trò chơi.');
        }
      } catch (err) {
        console.error(err);
        setError('Có lỗi xảy ra khi tải dữ liệu trò chơi. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400 font-medium">Đang tải thông tin chi tiết game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 shadow-xl">
          <HelpCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-400 mb-6">{error || 'Không tìm thấy trò chơi.'}</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại Cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyInCart = cartItems.some((item) => item.id === game.id);

  return (
    <div className="relative min-h-screen">
      {/* Background Banner Blur */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10 select-none pointer-events-none opacity-20">
        <img 
          src={game.header_img} 
          alt="" 
          className="w-full h-full object-cover filter blur-[80px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Nút quay lại */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-semibold mb-6 transition-colors group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại Cửa hàng
        </Link>

        {/* Header Grid: Title và Thông tin chung */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Cột Trái & Giữa: Media Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Ảnh lớn chính */}
            <div className="aspect-video bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 relative shadow-2xl">
              <img 
                src={activeImage} 
                alt={game.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* List ảnh nhỏ (Screenshots) */}
            {game.screenshots && game.screenshots.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {game.screenshots.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(src)}
                    className={`w-24 md:w-32 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImage === src ? 'border-blue-500 scale-95 shadow-md shadow-blue-500/25' : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cột Phải: Purchase Card & Meta Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tựa Game Nổi Bật
                </span>
                
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 tracking-tight">
                  {game.name}
                </h1>

                {/* Score */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1 text-amber-400 bg-amber-400/5 px-2.5 py-1 rounded-lg border border-amber-400/10">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-sm">Score: {game.user_score || 'N/A'}</span>
                  </div>
                  {game.stock > 0 ? (
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      Còn lại {game.stock} bản
                    </span>
                  ) : (
                    <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded-lg border border-red-400/20">
                      Hết hàng
                    </span>
                  )}
                </div>

                {/* Metadata list */}
                <div className="space-y-3.5 text-sm text-gray-400 mb-8 border-t border-gray-800/60 pt-5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>Ngày ra mắt: <strong className="text-gray-200 font-medium">{game.release_date || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>Phát triển: <strong className="text-gray-200 font-medium">{game.developer || 'N/A'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-gray-500 shrink-0" />
                    <span>Nhà phát hành: <strong className="text-gray-200 font-medium">{game.publisher || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-4 border-t border-gray-800/60 pt-4">
                  <span className="text-sm text-gray-400">Giá bán chính thức</span>
                  <span className="text-2xl md:text-3xl font-black text-green-400 tracking-tight">
                    {game.price}
                  </span>
                </div>

                {isAlreadyInCart ? (
                  <Link 
                    to="/cart"
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-center text-sm uppercase tracking-wider"
                  >
                    <Check className="w-5 h-5" />
                    Xem Trong Giỏ Hàng
                  </Link>
                ) : (
                  <button
                    disabled={game.stock === 0}
                    onClick={() => addToCart(game)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white font-extrabold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-sm uppercase tracking-wider"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body Section: About, Tags và Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chi tiết mô tả và cấu hình */}
          <div className="lg:col-span-2 space-y-8">
            {/* Giới thiệu */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-md">
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-500" />
                Giới thiệu trò chơi
              </h2>
              <div 
                className="text-gray-300 leading-relaxed text-sm md:text-base space-y-4 prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: game.about || game.description }}
              />
            </div>

            {/* Ngôn ngữ hỗ trợ */}
            {game.supported_languages && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-md">
                <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  Ngôn ngữ hỗ trợ
                </h2>
                <div 
                  className="text-gray-400 text-xs md:text-sm leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: game.supported_languages }}
                />
              </div>
            )}
          </div>

          {/* Tag, Thể loại bổ sung */}
          <div className="lg:col-span-1 space-y-6">
            {/* Danh mục & Tag */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-gray-800">Mác & Thể loại</h3>
              
              {game.tags && game.tags.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs text-gray-500 block mb-2 font-semibold uppercase tracking-wider">Từ khóa phổ biến</span>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-850 hover:bg-gray-800 border border-gray-850 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {game.categories && game.categories.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 block mb-2 font-semibold uppercase tracking-wider">Tính năng trò chơi</span>
                  <div className="flex flex-wrap gap-2">
                    {game.categories.map((c) => (
                      <span key={c} className="text-xs bg-gray-850 border border-gray-800 text-gray-400 px-3 py-1 rounded-lg">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
