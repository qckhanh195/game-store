require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 Chào mừng bạn đến với Game Store Backend API Demo!');
});

// Kết nối cơ sở dữ liệu MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Đã kết nối cơ sở dữ liệu MongoDB thành công.'))
  .catch((err) => console.error('❌ Lỗi kết nối cơ sở dữ liệu:', err));

app.use('/api/games', gameRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy mượt mà tại địa chỉ: http://localhost:${PORT}`);
});