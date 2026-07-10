# Hướng dẫn & Thuật toán Hệ thống Gợi ý (Recommendation System)

Tài liệu này giới thiệu chi tiết về hướng tiếp cận, mô hình toán học và các bước thực hiện của thuật toán gợi ý game (Recommendation System) được sử dụng trong dự án **GamesStore**.

---

## 🧠 1. Hướng tiếp cận: Content-Based Filtering (Lọc dựa trên nội dung)

Hệ thống gợi ý của **GamesStore** sử dụng hướng tiếp cận **Content-Based Filtering (Lọc dựa trên nội dung)** kết hợp với thước đo **Độ tương đồng Cosin (Cosine Similarity)**. 

### Lý do lựa chọn:
1. **Khắc phục lỗi "Khởi đầu lạnh" (Cold-start problem)**: Không cần dữ liệu lịch sử của hàng triệu người dùng khác. Chỉ cần hệ thống có game mới với thông tin tags, nhà phát triển,... là thuật toán có thể đưa ra gợi ý ngay lập tức.
2. **Bảo mật & Tốc độ**: Việc tính toán vector đặc trưng được thực hiện trực tiếp ở phía Client (trên trình duyệt người dùng thông qua React Hook). Điều này giúp giảm tải cho Backend và bảo mật lịch sử sở thích của người dùng.
3. **Tính minh bạch**: Thuật toán cho phép giải thích rõ ràng tại sao game lại được gợi ý (ví dụ: *"Có cùng thể loại RPG và nhà phát triển Valve với các game bạn đã mua"*).

---

## 🛠️ 2. Các thuộc tính đặc trưng và hệ thống Trọng số (Weights)

Thuật toán không đối xử với tất cả các thuộc tính của game như nhau mà gán cho mỗi thuộc tính một hệ số trọng số (weight) dựa trên mức độ ảnh hưởng của nó tới quyết định mua game:

| Thuộc tính | Trọng số | Ý nghĩa |
| :--- | :---: | :--- |
| **Tags (Nhãn)** | **5** | Thể loại game (Action, RPG, Indie, Shooter...). Đây là yếu tố quan trọng nhất phản ánh trực tiếp lối chơi. |
| **Developer (Nhà phát triển)** | **3** | Người chơi có xu hướng trung thành với phong cách làm game của một studio cụ thể (vd: Valve, FromSoftware). |
| **Categories (Danh mục)** | **1** | Các tính năng đi kèm (Single-player, Multi-player, Co-op, Steam Cloud...). |
| **Publisher (Nhà phát hành)** | **1** | Đơn vị phát hành game. |

---

## 🔄 3. Các bước thực hiện thuật toán trong mã nguồn

Quy trình gợi ý được chia làm 5 bước chính, được triển khai tại file [useRecommendations.js](file:///d:/project/GamesStore/frontend/src/hooks/useRecommendations.js):

### 📋 Bước 1: Số hóa thông tin game thành Vector đặc trưng (Feature Vector)
Với mỗi game, hệ thống duyệt qua các thuộc tính của nó, chuyển về chữ thường để tránh khớp lệch và xây dựng một đối tượng vector trọng số.
- **Hàm thực hiện**: `buildFeatureVector(game)`
- **Ví dụ**: Game *Counter-Strike 2* có thuộc tính:
  - Tags: `["Action", "Free to Play"]`
  - Developer: `"Valve"`
  - Categories: `["Multi-player"]`
- **Kết quả Vector**:
  $$\vec{V}_{\text{CS2}} = \{ \text{"action"}: 5, \text{"free to play"}: 5, \text{"valve"}: 3, \text{"multi-player"}: 1 \}$$

---

### 📏 Bước 2: Đo lường độ tương đồng bằng Cosine Similarity
Để biết game $A$ và game $B$ giống nhau bao nhiêu phần trăm, thuật toán tính góc Cosin giữa hai vector đặc trưng của chúng trong không gian đa chiều:

$$\text{Cosine Similarity}(\vec{A}, \vec{B}) = \frac{\vec{A} \cdot \vec{B}}{\|\vec{A}\| \|\vec{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \times \sqrt{\sum_{i=1}^{n} B_i^2}}$$

- **Tử số ($\vec{A} \cdot \vec{B}$)**: Tích vô hướng của các thuộc tính trùng nhau. Nếu hai game không trùng thuộc tính nào, kết quả là $0$.
- **Mẫu số ($\|\vec{A}\| \|\vec{B}\|$)**: Độ dài của từng vector để chuẩn hóa kích thước, tránh việc các game có quá nhiều tag được ưu tiên hơn.
- **Hàm thực hiện**: `cosineSimilarity(vecA, vecB)`

---

### 👤 Bước 3: Tổng hợp Vector sở thích cá nhân (User Profile Vector)
Khi người dùng đã mua danh sách các game (thư viện game đã mua), hệ thống gộp tất cả các vector của những game đó lại để tạo thành một vector đại diện cho sở thích của người dùng:

$$\vec{V}_{\text{Profile}} = \sum_{g \in \text{Purchased}} \vec{V}_g$$

- **Loại trừ chủ động**: Người dùng có thể bật/tắt (exclude) một game đã mua ra khỏi danh sách tính toán gợi ý nếu họ không muốn nhận các gợi ý liên quan đến tựa game đó nữa.
- **Hàm thực hiện**: `getPersonalizedRecommendations` nhận đầu vào là `purchasedGames` (được lọc qua `profileExcluded`).

---

### 📊 Bước 4: So sánh và Chuẩn hóa điểm số (Normalization)
Hệ thống tính toán điểm Cosine Similarity giữa $\vec{V}_{\text{Profile}}$ với toàn bộ các game khác trên cửa hàng.
Để kết quả hiển thị thân thiện, điểm số thập phân $[0.0, 1.0]$ được chuẩn hóa bằng phương pháp **Min-Max Normalization** về thang điểm phần trăm từ $[50\%, 98\%]$:

$$\text{Phần trăm tương thích} = 50 + \left( \frac{\text{Score} - \text{Score}_{\text{min}}}{\text{Score}_{\text{max}} - \text{Score}_{\text{min}}} \right) \times 45$$

*Điều này đảm bảo game phù hợp nhất sẽ hiển thị khoảng 95% - 98%, và game ít phù hợp nhất trong danh sách gợi ý sẽ ở mức 50%.*

---

### 🧹 Bước 5: Lọc bỏ và Phân nhóm (Filtering & Grouping)
- **Lọc bỏ**: Loại bỏ hoàn toàn các game người dùng đã sở hữu ra khỏi kết quả gợi ý.
- **Phân nhóm**: Nhóm các game gợi ý theo Thể loại chính của chúng (`categories[0]`) bằng hàm `groupByCategory` để giao diện hiển thị gọn gàng, có tổ chức khoa học.

---

## 🎨 4. Các điểm tích hợp thuật toán trên Giao diện (UI)

Hệ thống gợi ý được thể hiện ở hai nơi chính trên ứng dụng:

### A. Gợi ý Game Tương tự (Trang Chi tiết Game - `GameDetail.jsx`)
- Khi người dùng đang xem một game cụ thể, hệ thống sẽ gọi hàm `getSimilarGames(targetGame, allGames, 8)` để tìm kiếm và đề xuất 8 game có độ tương đồng Cosin cao nhất với game đó.

### B. Trang Gợi ý Cá nhân hóa (Trang Gợi ý riêng - `Recommendations.jsx`)
- Trang này tổng hợp dữ liệu từ thư viện game đã mua của bạn.
- Hiển thị thanh tiến trình độ tương thích chi tiết (Ví dụ: `92% Tương thích`).
- Có phần giải thích thuộc tính trùng khớp rõ ràng (ví dụ: `Trùng khớp: Action, Adventure, Valve`).
- **Nút Bật/Tắt ảnh hưởng**: Cho phép người dùng bấm loại trừ một game bất kỳ khỏi hồ sơ tính toán gợi ý ngay tại chỗ, danh sách gợi ý sẽ tự động cập nhật lại theo thời gian thực mà không cần tải lại trang.
