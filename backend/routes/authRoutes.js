const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Game = require('../models/Game');
const { protect } = require('../middleware/authMiddleware');

// Hàm lấy dữ liệu đầy đủ của user (kèm game đã mua)
const getFullUserResponse = async (user) => {
  const purchasedGamesData = await Game.find({ id: { $in: user.purchasedGames || [] } });
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    customId: user.customId,
    avatar: user.avatar,
    purchasedGames: purchasedGamesData,
    excludedGames: user.excludedGames || []
  };
};

// Hàm tạo JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký người dùng mới
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra các trường thông tin bắt buộc
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ Tên, Email và Mật khẩu.' });
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Định dạng email không hợp lệ.' });
    }

    // Kiểm tra mật khẩu độ dài tối thiểu
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    // Kiểm tra người dùng đã tồn tại chưa
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được đăng ký sử dụng.' });
    }

    // Mã hóa mật khẩu sử dụng bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (user) {
      const token = generateToken(user._id);

      // Thiết lập HttpOnly Cookie dự phòng
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
      });

      return res.status(201).json({
        message: 'Đăng ký tài khoản thành công.',
        token,
        user: await getFullUserResponse(user),
      });
    } else {
      return res.status(400).json({ message: 'Thông tin người dùng không hợp lệ.' });
    }
  } catch (error) {
    console.error('Lỗi khi Đăng ký:', error);
    return res.status(500).json({ message: `Lỗi máy chủ khi đăng ký: ${error.message}` });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập & Trả về JWT Token + Thiết lập Cookie
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ Email và Mật khẩu.' });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const token = generateToken(user._id);

    // Thiết lập HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    });

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      user: await getFullUserResponse(user),
    });
  } catch (error) {
    console.error('Lỗi khi Đăng nhập:', error);
    return res.status(500).json({ message: `Lỗi máy chủ khi đăng nhập: ${error.message}` });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Lấy thông tin tài khoản người dùng hiện tại
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    return res.status(200).json({
      user: await getFullUserResponse(req.user),
    });
  } catch (error) {
    console.error('Lỗi khi lấy Profile:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ, vui lòng thử lại sau.' });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Cập nhật thông tin cá nhân (Tên hiển thị, Custom Unique ID, Ảnh đại diện URL hoặc base64)
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
    }

    const { name, customId, avatar, excludedGames } = req.body;

    // Cập nhật tên hiển thị
    if (name) {
      user.name = name;
    }

    // Cập nhật customId (Unique ID tự chọn)
    if (customId !== undefined) {
      const cleanCustomId = customId.trim();
      if (cleanCustomId !== '') {
        // Kiểm tra xem ID này đã bị người khác sử dụng chưa
        const existingUser = await User.findOne({
          customId: cleanCustomId,
          _id: { $ne: user._id },
        });

        if (existingUser) {
          return res.status(400).json({
            message: 'ID người dùng này đã tồn tại trên hệ thống, vui lòng chọn ID khác.',
          });
        }
        user.customId = cleanCustomId;
      } else {
        // Nếu truyền rỗng, reset customId (do sparse index nên ta có thể lưu null hoặc undefined)
        user.customId = undefined;
      }
    }

    // Cập nhật avatar (Chấp nhận đường dẫn URL hoặc chuỗi ảnh Base64)
    if (avatar) {
      user.avatar = avatar;
    }

    // Cập nhật excludedGames
    if (excludedGames !== undefined) {
      user.excludedGames = excludedGames;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: 'Cập nhật tài khoản thành công.',
      user: await getFullUserResponse(updatedUser),
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật Profile:', error);
    return res.status(500).json({ message: `Lỗi máy chủ khi cập nhật Profile: ${error.message}` });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất xóa cookie phiên đăng nhập
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Đăng xuất thành công.' });
});

module.exports = router;
