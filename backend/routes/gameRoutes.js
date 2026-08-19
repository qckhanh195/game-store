const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// 1. API: Lấy danh sách game kèm Phân trang + Tìm kiếm + Bộ lọc
// URL mẫu: /api/games?page=1&limit=12&search=cyberpunk&tag=Action&category=Multiplayer&developer=Valve&genre=RPG&maxPrice=60
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const category = req.query.category || '';
    const developer = req.query.developer || '';
    const genre = req.query.genre || '';
    const maxPrice = req.query.maxPrice || '';

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (tag) {
      const tagsArray = tag.split(',').map(t => t.trim()).filter(Boolean);
      if (tagsArray.length > 0) query.tags = { $all: tagsArray };
    }

    if (category) {
      const catsArray = category.split(',').map(c => c.trim()).filter(Boolean);
      if (catsArray.length > 0) query.categories = { $all: catsArray };
    }

    if (developer) {
      query.developers = { $regex: developer, $options: 'i' };
    }

    if (genre) {
      const genresArray = genre.split(',').map(g => g.trim()).filter(Boolean);
      if (genresArray.length > 0) query.genres = { $all: genresArray };
    }

    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }

    const games = await Game.find(query)
      .sort({ peak_ccu: -1, positive: -1 })
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
    const sourceGame = await Game.findById(req.params.id);

    if (!sourceGame) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy game' });
    }

    const sourceTags = sourceGame.tags || [];
    const sourceCategories = sourceGame.categories || [];
    const sourceDeveloper = (sourceGame.developers && sourceGame.developers[0]) || '';

    // Lấy tất cả game khác, tính điểm tương đồng
    const allOtherGames = await Game.find({ _id: { $ne: sourceGame._id } });

    const scored = allOtherGames.map(game => {
      const gameTags = game.tags || [];
      const gameCategories = game.categories || [];

      // Đếm số tag chung
      const tagOverlap = gameTags.filter(t => sourceTags.includes(t)).length;
      // Đếm số category chung
      const categoryOverlap = gameCategories.filter(c => sourceCategories.includes(c)).length;
      // Bonus nếu cùng developer
      const gameDeveloper = (game.developers && game.developers[0]) || '';
      const developerMatch = gameDeveloper && gameDeveloper === sourceDeveloper ? 3 : 0;

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

// 3. API: Lấy chi tiết 1 game qua _id (ObjectId)
// URL mẫu: /api/games/665a1b2c3d4e5f6789012345
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
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
router.post('/checkout', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống!' });
    }

    for (let item of items) {
      const game = await Game.findById(item._id);
      if (!game) {
        return res.status(404).json({ success: false, message: `Game ID ${item._id} không tồn tại` });
      }
    }

    // Cập nhật game đã mua cho user trong db
    const user = await User.findById(req.user._id);
    console.log("DEBUG: Checkout user ID:", req.user._id, "Found user in DB:", !!user);
    if (user) {
      const purchasedIds = items.map(item => item._id);
      console.log("DEBUG: Checkout purchasedIds:", purchasedIds);
      const currentPurchased = user.purchasedGames || [];
      const currentSet = new Set(currentPurchased.map(id => id.toString()));
      const newIds = purchasedIds.filter(id => !currentSet.has(id.toString()));
      user.purchasedGames = [...currentPurchased, ...newIds];
      await user.save();
      console.log("DEBUG: Checkout saved user.purchasedGames:", user.purchasedGames);
    }

    res.json({ success: true, message: 'Thanh toán đơn hàng demo thành công! Kho hàng đã được cập nhật.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. API: Khôi phục kho hàng khi reset game đã mua
// URL: POST /api/games/reset-purchases
router.post('/reset-purchases', protect, async (req, res) => {
  try {
    const { gameIds } = req.body;

    if (!gameIds || gameIds.length === 0) {
      return res.json({ success: true, message: 'Thư viện đã trống.' });
    }

    // Cập nhật profile của user trong DB
    const user = await User.findById(req.user._id);
    if (user) {
      const removeSet = new Set(gameIds.map(id => id.toString()));
      user.purchasedGames = (user.purchasedGames || []).filter(id => !removeSet.has(id.toString()));
      user.excludedGames = (user.excludedGames || []).filter(id => !removeSet.has(id.toString()));
      await user.save();
    }

    res.json({ success: true, message: 'Đã hoàn trả số lượng game vào kho thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;