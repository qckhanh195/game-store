# GamesStore - Cửa Hàng Bán Game

Dự án **GamesStore** là một ứng dụng web cửa hàng bán game hiện đại, bao gồm hai phần chính:
* **Backend**: Xây dựng trên nền tảng Node.js, Express và kết nối cơ sở dữ liệu MongoDB.
* **Frontend**: Xây dựng bằng React (Vite) kết hợp với Tailwind CSS.

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend:
* **React** (Phiên bản 19)
* **Vite** (Bộ công cụ build siêu nhanh)
* **Tailwind CSS** (Framework CSS tiện lợi)
* **Axios** (Thư viện gửi HTTP Request)
* **Lucide React** (Bộ icon hiện đại)
* **React Router DOM** (Quản lý định tuyến)

### Backend:
* **Node.js** & **Express**
* **MongoDB** & **Mongoose** (ODM kết nối MongoDB)
* **Cors** (Cấu hình bảo mật chia sẻ tài nguyên)
* **Dotenv** (Quản lý biến môi trường)

---

## 📁 Cấu Trúc Dự Án

```text
GamesStore/
├── backend/            # Mã nguồn backend (API Server)
│   ├── models/         # Mongoose schemas/models
│   ├── routes/         # Các route xử lý API
│   ├── .env.example    # File mẫu cấu hình biến môi trường
│   ├── server.js       # File chạy chính của server
│   └── package.json    # Các dependencies của backend
│
├── frontend/           # Mã nguồn frontend (React App)
│   ├── public/         # Các file tĩnh (ảnh, icon...)
│   ├── src/            # Mã nguồn React
│   │   ├── components/ # Các component giao diện
│   │   ├── context/    # React Context (giỏ hàng, ...)
│   │   ├── hooks/      # Custom Hooks
│   │   ├── services/   # Cấu hình API client (Axios)
│   │   └── main.jsx    # Điểm khởi chạy của React
│   ├── package.json    # Các dependencies của frontend
│   └── vite.config.js  # Cấu hình dự án Vite
│
├── .gitignore          # Cấu hình các file không đẩy lên Git
└── README.md           # Hướng dẫn dự án này
```

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
4. Cấu hình địa chỉ kết nối MongoDB trong file `backend/.env`:
   * **Nếu chạy Database trên Cloud (MongoDB Atlas):** Cập nhật đường link kết nối của bạn vào biến `MONGO_URI` (nhớ thay đổi tài khoản, mật khẩu thực tế của bạn).
   * **Nếu chạy Database ở Local (chạy bằng lauchpad MongoDB):** Thêm dấu `#` vào đầu dòng link Atlas và bỏ dấu `#` trước dòng địa chỉ Local.
5. Khởi chạy Backend Server:
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

## 🔒 Lưu Ý Quan Trọng Về Bảo Mật (Lưu trữ biến môi trường)

> [!WARNING]
> **Không bao giờ push file `.env` chứa mật khẩu thực tế lên GitHub.**
>
> File `.env` chứa các thông tin nhạy cảm (như tài khoản, mật khẩu kết nối database). Để đảm bảo an toàn, dự án đã cấu hình file `.gitignore` ở thư mục gốc để bỏ qua các file `.env` này.

### Xử lý nếu lỡ push file `.env` lên Git
Nếu trước đây file `backend/.env` đã từng được push và đang bị Git theo dõi (track), hãy chạy lệnh sau từ thư mục gốc của dự án để loại bỏ nó khỏi bộ nhớ đệm của Git mà không làm mất file trên máy của bạn:

```bash
git rm --cached backend/.env
git commit -m "Remove sensitive .env from git tracking"
git push
```
Sau đó, các thành viên khác khi clone code về sẽ chỉ nhận được file cấu hình mẫu `backend/.env.example` và tự tạo file `.env` riêng trên máy của họ.
