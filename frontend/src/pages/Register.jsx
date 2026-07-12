import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Nếu người dùng đã đăng nhập, tự động chuyển hướng về trang chủ
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validate đầu vào trên Frontend
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Định dạng email không hợp lệ.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp.');
      setIsSubmitting(false);
      return;
    }

    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
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
              <UserPlus className="w-8 h-8 text-[#FF6B4A]" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-widest text-[#F0EDE6] uppercase">
            Đăng ký
          </h2>
          <p className="mt-2 text-center text-xs text-[#8B9DB5]">
            Tạo tài khoản mới để trải nghiệm mua sắm game chuyên nghiệp
          </p>
        </div>

        {error && (
          <div className="bg-[#F87171]/10 border border-[#F87171]/30 p-4 flex items-start gap-3 text-sm text-[#F87171]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-1.5">
                Tên hiển thị (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#4A6180]" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                             focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                             focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                  placeholder="Tối thiểu 6 ký tự"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-1.5">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#4A6180]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                             focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-display tracking-wider font-bold uppercase text-[#0F1923] bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF6B4A] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[#0F1923] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Đăng ký tài khoản'
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-[#8B9DB5]">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-bold text-[#FF6B4A] hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
