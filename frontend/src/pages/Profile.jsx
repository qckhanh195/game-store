import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Image as ImageIcon, CheckCircle, AlertCircle, Camera, Link as LinkIcon } from 'lucide-react';

export default function Profile() {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [customId, setCustomId] = useState('');
  const [avatar, setAvatar] = useState('');
  
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarType, setAvatarType] = useState('url'); // 'url' hoặc 'upload'
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bảo vệ route: Nếu không đăng nhập thì chuyển sang /login
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        setName(user.name || '');
        setCustomId(user.customId || '');
        setAvatar(user.avatar || '');
        setAvatarPreview(user.avatar || 'https://placehold.co/150');
      }
    }
  }, [user, loading, navigate]);

  // Cập nhật preview khi đổi URL avatar
  const handleAvatarUrlChange = (e) => {
    const url = e.target.value;
    setAvatar(url);
    if (url.trim() !== '') {
      setAvatarPreview(url);
    } else {
      setAvatarPreview('https://placehold.co/150');
    }
  };

  // Xử lý đọc file cục bộ và chuyển sang Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Giới hạn dung lượng file (VD: 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAvatar(base64String);
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);

    if (!name.trim()) {
      setMessage({ type: 'error', text: 'Tên hiển thị không được bỏ trống.' });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name,
      customId: customId.trim() || undefined,
      avatar: avatar.trim() || undefined,
    };

    const result = await updateProfile(payload);
    setIsSubmitting(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Clear alert message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B4A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-up">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="w-full md:w-1/3 bg-[#162232] border border-[#253549] p-6 flex flex-col items-center text-center h-fit">
          <h3 className="text-sm font-display tracking-wider text-[#8B9DB5] uppercase mb-6">Ảnh đại diện</h3>
          
          <div className="relative group w-32 h-32 mb-6">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-full h-full object-cover border border-[#253549] bg-[#0F1923]"
              onError={(e) => {
                e.target.src = 'https://placehold.co/150';
              }}
            />
            <div
              onClick={avatarType === 'upload' ? triggerFileInput : undefined}
              className={`absolute inset-0 bg-[#0F1923]/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-[#FF6B4A] ${
                avatarType === 'url' ? 'pointer-events-none' : ''
              }`}
            >
              <Camera className="w-6 h-6 text-[#FF6B4A] mb-1" />
              <span className="text-[10px] uppercase tracking-wider text-[#FF6B4A] font-bold">Thay ảnh</span>
            </div>
          </div>

          <div className="w-full border-t border-[#253549] pt-4 mb-4">
            <div className="text-sm font-display font-bold text-[#F0EDE6] truncate">{user.name}</div>
            <div className="text-xs text-[#8B9DB5] truncate mt-1">{user.email}</div>
            {user.customId && (
              <div className="inline-block bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 px-2 py-0.5 mt-2 text-[10px] text-[#FF6B4A] font-display">
                ID: {user.customId}
              </div>
            )}
          </div>

          {/* Toggle Avatar Method */}
          <div className="grid grid-cols-2 gap-1 w-full bg-[#0F1923] p-1 border border-[#253549]">
            <button
              type="button"
              onClick={() => setAvatarType('url')}
              className={`py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-1 ${
                avatarType === 'url' ? 'bg-[#FF6B4A] text-[#0F1923]' : 'text-[#8B9DB5] hover:text-[#F0EDE6]'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              Từ URL
            </button>
            <button
              type="button"
              onClick={() => setAvatarType('upload')}
              className={`py-1.5 text-[10px] uppercase font-bold tracking-wider transition-all flex items-center justify-center gap-1 ${
                avatarType === 'upload' ? 'bg-[#FF6B4A] text-[#0F1923]' : 'text-[#8B9DB5] hover:text-[#F0EDE6]'
              }`}
            >
              <Camera className="w-3 h-3" />
              Tải ảnh lên
            </button>
          </div>
        </div>

        {/* Right Side: Account Settings Form */}
        <div className="flex-1 bg-[#162232] border border-[#253549] p-6 md:p-8">
          <div className="flex items-center gap-2 border-b border-[#253549] pb-4 mb-6">
            <User className="w-5 h-5 text-[#FF6B4A]" />
            <h2 className="text-lg font-display tracking-widest text-[#F0EDE6] uppercase font-bold">
              Thông tin tài khoản
            </h2>
          </div>

          {message.text && (
            <div
              className={`mb-6 p-4 border flex items-start gap-3 text-sm ${
                message.type === 'success'
                  ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]'
                  : 'bg-[#F87171]/10 border-[#F87171]/30 text-[#F87171]'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Email (Readonly) */}
            <div>
              <label className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-2">
                Địa chỉ Email (Không thể thay đổi)
              </label>
              <div className="flex items-center gap-3 bg-[#0F1923] border border-[#253549] px-3 py-2.5 text-sm text-[#4A6180]">
                <Shield className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-2">
                Tên hiển thị (Username)
              </label>
              <input
                id="username"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                           focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                placeholder="Nhập tên của bạn"
              />
            </div>

            {/* Custom Unique ID Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="customId" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase">
                  ID người dùng (Custom Unique ID)
                </label>
                <span className="text-[10px] text-[#4A6180] italic">Chỉ được chứa chữ, số, gạch ngang và không trùng lặp</span>
              </div>
              <input
                id="customId"
                type="text"
                value={customId}
                onChange={(e) => setCustomId(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                className="block w-full px-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                           focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                placeholder="ví dụ: goku_99 (để trống nếu không sử dụng)"
              />
            </div>

            {/* Avatar Selection Details */}
            {avatarType === 'url' ? (
              <div>
                <label htmlFor="avatarUrl" className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-2">
                  Đường dẫn Ảnh đại diện (Avatar URL)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-[#4A6180]" />
                  </div>
                  <input
                    id="avatarUrl"
                    type="url"
                    value={avatar}
                    onChange={handleAvatarUrlChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-[#253549] bg-[#0F1923] text-[#F0EDE6] placeholder-[#4A6180] 
                               focus:outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A] text-sm transition-all"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-display tracking-wider text-[#8B9DB5] uppercase mb-2">
                  Tải ảnh từ máy tính (JPG, PNG, GIF, tối đa 2MB)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[#253549] hover:border-[#FF6B4A] bg-[#0F1923] px-3 py-4 text-xs font-display tracking-wider uppercase text-[#8B9DB5] hover:text-[#FF6B4A] transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Chọn File ảnh từ thiết bị
                </button>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-[#253549] pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 text-sm font-display tracking-wider font-bold uppercase text-[#0F1923] bg-[#FF6B4A] hover:bg-[#FF6B4A]/90 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#0F1923] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Lưu thay đổi'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
