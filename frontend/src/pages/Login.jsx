import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Nếu người dùng đã đăng nhập, tự động chuyển hướng về trang cá nhân
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      setIsSubmitting(false);
      return;
    }

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-[#162232] border border-[#253549] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6B4A]/10 clip-diagonal transform rotate-45 translate-x-8 -translate-y-8 pointer-events-none"></div>
        
        <div>
          <div className="flex justify-center">
            <div className="bg-[#FF6B4A]/15 p-3 rounded-full border border-[#FF6B4A]/30">
              <LogIn className="w-8 h-8 text-[#FF6B4A]" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-widest text-[#F0EDE6] uppercase">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-xs text-[#8B9DB5]">
            Đăng nhập để lưu trữ thư viện game và nhận gợi ý phù hợp
          </p>
        </div>

        {error && (
          <div className="bg-[#F87171]/10 border border-[#F87171]/30 p-4 flex items-start gap-3 text-sm text-[#F87171]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#4A6180]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                             focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                  placeholder="name@domain.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#4A6180]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                             focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8B9DB5] hover:text-[#FF6B4A] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-display tracking-wider font-bold uppercase text-[#0F1923] bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B4A] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0F1923] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-[#8B9DB5]">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-[#FF6B4A] hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
