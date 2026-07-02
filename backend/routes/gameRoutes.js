const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// 1. API: Lấy danh sách game kèm Phân trang + Tìm kiếm + Bộ lọc
// URL mẫu: /api/games?page=1&limit=12&search=cyberpunk&tag=Action&maxPrice=500000
router.get('/', async (req, res) => {
  try {
    // Đọc các tham số từ URL gửi lên, nếu không có thì lấy giá trị mặc định
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const maxPrice = req.query.maxPrice || '';

    // Khởi tạo đối tượng truy vấn (Query Object)
    let query = {};

    // Logic Tìm kiếm theo tên (Không phân biệt chữ hoa/thường)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Logic Lọc theo Thể loại (Tag)
    if (tag) {
      query.tags = tag; // Tìm kiếm tag nằm trong mảng tags của game
    }

    // Logic Lọc theo giá tiền tối đa (Dựa trên số price_raw đã chuẩn hóa ở Bước 1)
    if (maxPrice) {
      query.price_raw = { $lte: parseInt(maxPrice) };
    }

    // Thực hiện truy vấn có Phân trang bằng cách dùng .skip() và .limit()
    const games = await Game.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    // Đếm tổng số game thỏa mãn điều kiện để React biết có bao nhiêu trang tất cả
    const totalGames = await Game.countDocuments(query);

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalGames / limit),
      totalGames,
      data: games
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. API: Lấy chi tiết 1 game qua ID (Phục vụ trang xem chi tiết game ở Frontend)
// URL mẫu: /api/games/271590
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    if (!game) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy game' });
    }
    res.json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. API: Mua hàng / Thanh toán Demo (Trừ kho, tăng số lượng đã bán)
// URL: POST /api/games/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { items } = req.body; // Mảng chứa danh sách sản phẩm React gửi lên, ví dụ: [{ id: 570, quantity: 1 }]
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
    }

    // Vòng lặp kiểm tra và cập nhật kho cho từng game trong giỏ hàng
    for (let item of items) {
      const game = await Game.findOne({ id: item.id });
      if (!game) {
        return res.status(404).json({ success: false, message: `Game ID ${item.id} không tồn tại` });
      }

      if (game.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Game ${game.name} đã hết hàng hoặc không đủ số lượng tồn kho!` });
      }

      // Thực hiện trừ kho (stock) và cộng số lượng đã bán (sold)
      await Game.updateOne(
        { id: item.id },
        { 
          $inc: { 
            stock: -item.quantity, 
            sold: item.quantity 
          } 
        }
      );
    }

    res.json({ success: true, message: 'Thanh toán đơn hàng demo thành công! Kho hàng đã được cập nhật.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;