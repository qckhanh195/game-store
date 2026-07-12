# GamesStore

Dự án **GamesStore** là một ứng dụng web cửa hàng bán game hiện đại, bao gồm hai phần chính:
* **Backend**: Xây dựng trên nền tảng Node.js, Express và kết nối cơ sở dữ liệu MongoDB.
* **Frontend**: Xây dựng bằng React (Vite) kết hợp với Tailwind CSS.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend:
* **React** (Phiên bản 19)
* **Vite** (Bộ công cụ build siêu nhanh)
* **Tailwind CSS** (Framework CSS tiện lợi)
* **Axios** (Thư viện gửi HTTP Request & Quản lý Interceptors tự động đính kèm token)
* **Lucide React** (Bộ icon hiện đại)
* **React Router DOM** (Quản lý định tuyến và điều hướng)
* **Context API** (Quản lý trạng thái Đăng nhập và Giỏ hàng toàn cục)

### Backend:
* **Node.js** & **Express**
* **MongoDB** & **Mongoose** (ODM kết nối MongoDB)
* **BcryptJS** (Mã hóa một chiều mật khẩu người dùng)
* **JsonWebToken** (Xác thực & phân quyền bảo mật)
* **Cors** (Cấu hình bảo mật chia sẻ tài nguyên)
* **Dotenv** (Quản lý biến môi trường)

---

## 🔑 Tính Năng Xác Thực & Quản Lý Tài Khoản

Hệ thống được phát triển hoàn chỉnh với các tính năng:
1. **Đăng ký (Register)**: Cho phép người dùng đăng ký bằng Tên hiển thị, Email và Mật khẩu. Mật khẩu được băm bảo mật bằng `bcryptjs` trước khi lưu vào DB.
2. **Đăng nhập (Login)**: Xác thực email và mật khẩu, thiết lập HttpOnly Cookie dự phòng đồng thời trả về mã JWT Token lưu trữ ở Client-side.
3. **Bảo vệ Routes (Auth Middleware)**: Middleware `protect` ở Backend giúp xác thực token JWT gửi kèm qua header `Authorization: Bearer <token>` để bảo vệ các tuyến đường dữ liệu nhạy cảm.
4. **Quản lý tài khoản (Profile Management)**:
   - Cho phép thay đổi tên hiển thị (Username).
   - Thiết lập/Thay đổi ID người dùng tùy chọn (`customId`), đảm bảo tính duy nhất không trùng lặp toàn hệ thống.
   - Cập nhật Ảnh đại diện (Avatar) linh hoạt: Nhập link ảnh trực tiếp hoặc chọn tải ảnh lên từ thiết bị (đọc file dưới dạng chuỗi base64 và đồng bộ qua API).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Bước 1: Clone dự án về máy
Mở Terminal của bạn và chạy lệnh sau:
```bash
git clone https://github.com/qckhanh195/game-store.git
cd GamesStore
```

---

### Bước 2: Cài đặt và cấu hình Backend

1. Di chuyển vào thư mục `backend`:
   ```bash
   cd backend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env` từ file ví dụ `.env.example`:
   * Tạo một file mới tên là `.env` nằm trực tiếp trong thư mục `backend`.
   * Copy toàn bộ nội dung từ file `.env.example` sang file `.env` vừa tạo.
   * Đảm bảo cấu hình đúng đường dẫn kết nối MongoDB `MONGO_URI` và khóa bí mật `JWT_SECRET` trong file `.env`:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_uri
     JWT_SECRET=your_secret_key_here
     JWT_EXPIRES_IN=7d
     ```
4. Khởi chạy Backend Server:
   ```bash
   npm run dev
   # Hoặc chạy: npm start
   ```
   * *Mặc định Backend sẽ chạy tại địa chỉ:* `http://localhost:5000`

---

### Bước 3: Cài đặt và cấu hình Frontend

1. Mở một terminal mới và di chuyển vào thư mục `frontend`:
   ```bash
   cd frontend
   ```
2. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Khởi chạy Frontend:
   ```bash
   npm run dev
   ```
   * *Mặc định Frontend chạy tại:* `http://localhost:5173` (hoặc cổng được hiển thị trong terminal). Bạn có thể mở trình duyệt và truy cập vào địa chỉ này để sử dụng ứng dụng.

---

## 🧠 Tài liệu thuật toán gợi ý
Xem hướng tiếp cận và chi tiết các bước thực hiện thuật toán tại: **[RECOMMENDATION_SYSTEM.md](docs/RECOMMENDATION_SYSTEM.md)**.