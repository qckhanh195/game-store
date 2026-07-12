const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin người dùng từ token (loại bỏ trường mật khẩu)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Không tìm thấy người dùng với token này.' });
      }

      next();
    } catch (error) {
      console.error('Lỗi xác thực JWT:', error);
      return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ.' });
    }
  } else {
    return res.status(401).json({ message: 'Không có quyền truy cập, thiếu token.' });
  }
};

module.exports = { protect };
