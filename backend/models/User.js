const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  customId: { type: String, unique: true, sparse: true },
  avatar: { type: String, default: "https://placehold.co/150" },
  purchasedGames: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  excludedGames: { type: [mongoose.Schema.Types.ObjectId], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);