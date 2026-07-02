import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import axios from 'axios';
import { Trash2, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Gamepad2 } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hàm định dạng giá tiền VND
  const formatPrice = (rawPrice) => {
    if (rawPrice === 0) return 'Miễn phí';
    const val = rawPrice / 100;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Tính tổng tiền
  const totalRaw = cartItems.reduce((sum, item) => sum + (item.price_raw || 0), 0);
  const totalAmount = formatPrice(totalRaw);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        items: cartItems.map(item => ({ id: item.id, quantity: 1 }))
      };
      
      const response = await axios.post('http://localhost:5000/api/games/checkout', payload);
      
      if (response.data.success) {
        setSuccessMsg(response.data.message || 'Thanh toán thành công! Trân trọng cảm ơn.');
        clearCart();
      } else {
        setErrorMsg(response.data.message || 'Thanh toán thất bại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Nếu thanh toán thành công, hiển thị trang chúc mừng
  if (successMsg) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-xl">
        <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative glowing gradient */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-16 h-16" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">THANH TOÁN THÀNH CÔNG!</h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            {successMsg}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-5 h-5" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight flex items-center gap-3">
        <ShoppingBag className="text-blue-500 w-8 h-8" />
        GIỎ HÀNG CỦA BẠN
      </h1>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3.5 rounded-xl mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm font-medium">{errorMsg}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gray-800 rounded-full text-gray-500">
              <ShoppingBag className="w-16 h-16" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Hãy khám phá cửa hàng của chúng tôi để tìm thấy những tựa game hấp dẫn nhất!</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all"
          >
            Khám phá Cửa hàng
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách vật phẩm trong giỏ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-850">
              <span className="text-sm text-gray-400">{cartItems.length} sản phẩm</span>
              <button 
                onClick={clearCart}
                className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                Xóa tất cả
              </button>
            </div>

            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex gap-4 transition-all"
              >
                <Link to={`/game/${item.id}`} className="w-28 md:w-36 h-20 md:h-24 rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={item.header_img} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <Link to={`/game/${item.id}`} className="hover:text-blue-400 transition-colors">
                      <h3 className="font-bold text-base md:text-lg text-white line-clamp-1">{item.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Phát triển bởi: {item.developer || 'N/A'}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags?.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-400 font-bold text-sm md:text-base">
                      {item.price_raw === 0 ? 'Miễn phí' : item.price}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-gray-850 rounded-lg transition-all"
                      title="Xóa khỏi giỏ hàng"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hóa đơn / Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-gray-800">TÓM TẮT ĐƠN HÀNG</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Giá tạm tính</span>
                  <span className="text-white font-semibold">{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Thuế VAT & Phí dịch vụ</span>
                  <span className="text-emerald-400 font-semibold">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-gray-800 flex justify-between text-white font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-blue-400 font-black">{totalAmount}</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-blue-800 disabled:to-indigo-800 text-white font-extrabold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-base tracking-wide"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Thanh toán ngay
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-gray-500 mt-4 leading-relaxed">
                Bằng cách nhấn thanh toán, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của GameStore.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
