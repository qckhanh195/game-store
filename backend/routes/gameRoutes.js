const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// 1. API: Lấy danh sách game kèm Phân trang + Tìm kiếm + Bộ lọc
// URL mẫu: /api/games?page=1&limit=12&search=cyberpunk&tag=Action&category=Multiplayer&developer=Valve&maxPrice=500000
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const category = req.query.category || '';
    const developer = req.query.developer || '';
    const maxPrice = req.query.maxPrice || '';

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (tag) {
      query.tags = tag;
    }

    if (category) {
      query.categories = category;
    }

    if (developer) {
      query.developer = { $regex: developer, $options: 'i' };
    }

    if (maxPrice) {
      query.price_raw = { $lte: parseInt(maxPrice) };
    }

    const games = await Game.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

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

// 2. API: Lấy danh sách game tương tự dựa trên tags overlap (Content-based)
// URL: /api/games/similar/:id?limit=8
router.get('/similar/:id', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const sourceGame = await Game.findOne({ id: req.params.id });

    if (!sourceGame) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy game' });
    }

    const sourceTags = sourceGame.tags || [];
    const sourceCategories = sourceGame.categories || [];
    const sourceDeveloper = sourceGame.developer || '';

    // Lấy tất cả game khác, tính điểm tương đồng
    const allOtherGames = await Game.find({ id: { $ne: sourceGame.id } });

    const scored = allOtherGames.map(game => {
      const gameTags = game.tags || [];
      const gameCategories = game.categories || [];

      // Đếm số tag chung
      const tagOverlap = gameTags.filter(t => sourceTags.includes(t)).length;
      // Đếm số category chung
      const categoryOverlap = gameCategories.filter(c => sourceCategories.includes(c)).length;
      // Bonus nếu cùng developer
      const developerMatch = game.developer && game.developer === sourceDeveloper ? 3 : 0;

      // Score: tag trọng số 2, category trọng số 1.5, developer bonus 3
      const score = tagOverlap * 2 + categoryOverlap * 1.5 + developerMatch;

      return { game, score };
    });

    // Sắp xếp theo score giảm dần, lấy top limit
    const similar = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.game);

    res.json({ success: true, data: similar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. API: Lấy chi tiết 1 game qua ID
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

// 4. API: Mua hàng / Thanh toán Demo
// URL: POST /api/games/checkout
router.post('/checkout', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
    }

    for (let item of items) {
      const game = await Game.findOne({ id: item.id });
      if (!game) {
        return res.status(404).json({ success: false, message: `Game ID ${item.id} không tồn tại` });
      }

      if (game.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Game ${game.name} đã hết hàng hoặc không đủ số lượng tồn kho!` });
      }

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