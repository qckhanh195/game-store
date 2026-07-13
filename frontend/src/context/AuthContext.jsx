import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  syncUser: async () => {},
});

const TOKEN_KEY = 'gamestore_token';
const USER_KEY = 'gamestore_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục phiên đăng nhập khi khởi chạy
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        try {
          // Lấy thông tin mới nhất từ Backend để cập nhật
          // Axios interceptor đã được thiết lập để đính kèm Token này
          const response = await api.get('/auth/profile');
          const freshUser = response.data.user;
          setUser(freshUser);
          localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
        } catch (error) {
          console.error('Không thể xác thực token cũ, tiến hành đăng xuất:', error);
          // Token hết hạn hoặc không hợp lệ -> xóa sạch
          logoutState();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logoutState = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Đăng ký tài khoản
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error('Lỗi chi tiết khi đăng ký:', error);
      let errorMsg = 'Có lỗi xảy ra trong quá trình đăng ký.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = `Lỗi kết nối hoặc mạng: ${error.message}`;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  // Đăng nhập tài khoản
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      console.error('Lỗi chi tiết khi đăng nhập:', error);
      let errorMsg = 'Email hoặc mật khẩu không đúng.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = `Lỗi kết nối hoặc mạng: ${error.message}`;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Lỗi khi gọi API đăng xuất:', error);
    } finally {
      logoutState();
    }
  };

  // Cập nhật thông tin tài khoản
  const updateProfile = async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      const { user: updatedUser } = response.data;

      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Lỗi chi tiết khi cập nhật Profile:', error);
      let errorMsg = 'Có lỗi xảy ra khi cập nhật thông tin.';
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = `Lỗi kết nối hoặc mạng: ${error.message}`;
      }
      return {
        success: false,
        message: errorMsg,
      };
    }
  };

  // Đồng bộ thông tin tài khoản từ backend
  const syncUser = async () => {
    try {
      const response = await api.get('/auth/profile');
      const freshUser = response.data.user;
      setUser(freshUser);
      localStorage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch (error) {
      console.error('Không thể đồng bộ thông tin tài khoản:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
