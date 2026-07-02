const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  release_date: String,
  price: String,
  price_raw: Number,
  about: String,
  header_img: String,
  supported_languages: String,
  developer: String,
  publisher: String,
  categories: [String],
  screenshots: [String],
  user_score: mongoose.Schema.Types.Mixed,
  tags: [String],
  is_free: Boolean,
  description: String,
  stock: { type: Number, default: 10 },
  sold: { type: Number, default: 0 }
});

module.exports = mongoose.model('Game', gameSchema, 'games');