import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { gameApi } from '../services/api';
import {
  Trash2, ShoppingBag, ArrowRight, CheckCircle2, AlertCircle,
  RefreshCw, Gamepad2, ShoppingCart,
} from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, clearCart, addToPurchased } = useCart();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formatPrice = (rawPrice) => {
    if (!rawPrice || rawPrice === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawPrice / 100);
  };

  const totalRaw = cartItems.reduce((sum, item) => sum + (item.price_raw || 0), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const itemsPayload = cartItems.map((item) => ({ id: item.id, quantity: 1 }));
      const data = await gameApi.checkout(itemsPayload);

      if (data.success) {
        addToPurchased(cartItems); // Lưu vào danh sách đã mua
        setSuccessMsg(data.message || 'Thanh toán thành công!');
        clearCart();
      } else {
        setErrorMsg(data.message || 'Thanh toán thất bại.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (successMsg) {
    return (
      <div className="min-h-screen bg-[#0F1923] flex items-center justify-center px-6">
        <div className="border border-[#4ADE80]/20 bg-[#162232] p-10 md:p-14 text-center max-w-lg w-full animate-fade-up">
          <div className="flex justify-center mb-6">
            <div className="border border-[#4ADE80]/30 p-5 text-[#4ADE80]">
              <CheckCircle2 className="w-14 h-14" />
            </div>
          </div>
          <p className="font-display text-xs tracking-widest text-[#4ADE80] mb-2">// THÀNH CÔNG</p>
          <h2 className="font-display text-3xl font-bold text-[#F0EDE6] mb-4">
            THANH TOÁN THÀNH CÔNG!
          </h2>
          <p className="text-[#8B9DB5] mb-8 leading-relaxed">{successMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3
                         border border-[#253549] text-sm font-display tracking-wide text-[#8B9DB5]
                         hover:border-[#FF6B4A] hover:text-[#FF6B4A] transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/da-mua"
              className="flex items-center justify-center gap-2 px-6 py-3
                         bg-[#4ADE80] text-[#0F1923] text-sm font-display font-bold tracking-wide
                         hover:bg-[#4ADE80]/90 transition-colors"
            >
              Xem game đã mua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1923] text-[#F0EDE6] font-body">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="font-display text-3xl font-bold text-[#F0EDE6] mb-2 flex items-center gap-3 animate-fade-up">
          <span className="text-[#FF6B4A] text-base tracking-widest">//</span>
          GIỎ HÀNG
        </h1>
        <p className="text-[#8B9DB5] text-sm mb-8 animate-fade-up animate-delay-1">
          {cartItems.length} sản phẩm đang chờ thanh toán
        </p>

        {/* Error */}
        {errorMsg && (
          <div className="border border-[#F87171]/30 bg-[#F87171]/5 text-[#F87171] px-4 py-3 mb-6 flex items-center gap-3 animate-fade-up">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {/* Empty state */}
        {cartItems.length === 0 ? (
          <div className="border border-[#253549] bg-[#162232] p-14 text-center animate-fade-up">
            <ShoppingBag className="w-14 h-14 text-[#4A6180] mx-auto mb-5" />
            <h2 className="font-display text-xl font-semibold text-[#F0EDE6] mb-2">Giỏ hàng trống</h2>
            <p className="text-[#8B9DB5] text-sm mb-8 max-w-xs mx-auto">
              Hãy khám phá cửa hàng để tìm những tựa game hấp dẫn!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-[#FF6B4A] text-[#FF6B4A]
                         px-6 py-3 text-sm font-display tracking-wide hover:bg-[#FF6B4A] hover:text-[#0F1923] transition-all"
            >
              Khám phá cửa hàng
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up animate-delay-2">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-[#253549]">
                <span className="text-xs text-[#4A6180] font-display tracking-wide">SẢN PHẨM</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-[#F87171] hover:text-[#F87171]/80 font-display tracking-wide transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#253549] bg-[#162232] p-4 flex gap-4
                             hover:border-[#8B9DB5]/30 transition-all"
                >
                  <Link
                    to={`/game/${item.id}`}
                    className="w-28 md:w-36 aspect-video overflow-hidden shrink-0 border border-[#253549]"
                  >
                    <img
                      src={item.header_img}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <Link to={`/game/${item.id}`}>
                        <h3 className="font-display font-semibold text-base text-[#F0EDE6]
                                       hover:text-[#FF6B4A] transition-colors truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#4A6180] mt-1">
                        {item.developer || 'N/A'}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags?.slice(0, 2).map((t) => (
                          <span key={t} className="text-[10px] border border-[#253549] text-[#4A6180] px-2 py-0.5 font-display">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-display font-bold text-[#FFB830] text-sm">
                        {item.price_raw === 0 ? 'Miễn phí' : item.price}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-[#4A6180] hover:text-[#F87171] hover:bg-[#F87171]/5
                                   border border-transparent hover:border-[#F87171]/20 transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="border border-[#253549] bg-[#162232] p-6 sticky top-20">
                <h2 className="font-display text-base font-semibold text-[#F0EDE6] mb-5 pb-4 border-b border-[#253549]
                               flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#FF6B4A]" />
                  TÓM TẮT ĐƠN HÀNG
                </h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-[#8B9DB5]">
                    <span>Giá tạm tính ({cartItems.length} sản phẩm)</span>
                    <span className="text-[#F0EDE6] font-display font-semibold">{formatPrice(totalRaw)}</span>
                  </div>
                  <div className="flex justify-between text-[#8B9DB5]">
                    <span>Thuế & Phí</span>
                    <span className="text-[#4ADE80] font-display">Miễn phí</span>
                  </div>
                  <div className="pt-3 border-t border-[#253549] flex justify-between">
                    <span className="font-display font-semibold text-[#F0EDE6]">Tổng cộng</span>
                    <span className="font-display text-lg font-bold text-[#FFB830]">{formatPrice(totalRaw)}</span>
                  </div>
                </div>

                <button
                  disabled={loading}
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-[#FF6B4A] text-[#0F1923] font-display font-bold
                             text-sm tracking-widest flex items-center justify-center gap-2
                             hover:bg-[#FF6B4A]/90 disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors cursor-pointer"
                >
                  {loading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                  ) : (
                    <>Thanh toán ngay <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="text-center text-[10px] text-[#4A6180] mt-4 leading-relaxed">
                  Bằng cách nhấn thanh toán, bạn đồng ý với Điều khoản dịch vụ của GameStore.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
