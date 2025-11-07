# 📁 Cấu trúc Dự án HRM System

## 📂 Tổ chức Thư mục

Dự án đã được tổ chức lại với cấu trúc rõ ràng và dễ quản lý:

```
HRmOfLink/
├── assets/                      # Tài nguyên tĩnh
│   ├── css/                     # File CSS
│   │   └── sitai.css           # Stylesheet chính
│   └── js/                      # File JavaScript chính
│       └── app.js              # Entry point của ứng dụng
│
├── modules/                     # Các module chức năng
│   ├── authModule.js           # Xác thực & đăng nhập
│   ├── dashboardModule.js      # Bảng điều khiển
│   ├── employeeManagementModule.js  # Quản lý nhân sự tổng hợp
│   ├── employeeDbModule.js     # Database nhân viên
│   ├── addEmployeeModule.js    # Thêm nhân viên
│   ├── editEmployeeModule.js   # Sửa thông tin nhân viên
│   ├── deleteEmployeeModule.js # Xóa nhân viên
│   ├── searchEmployeeModule.js # Tìm kiếm nhân viên
│   ├── departmentModule.js     # Quản lý phòng ban
│   ├── positionModule.js       # Quản lý vị trí
│   ├── salaryModule.js         # Quản lý lương
│   ├── attendanceModule.js     # Chấm công
│   ├── leaveModule.js          # Nghỉ phép
│   └── performanceModule.js    # Đánh giá hiệu suất
│
├── tests/                       # File kiểm thử
│   ├── test.html               # Test HTML đơn giản
│   ├── test_api_call.html      # Test API calls (HTML)
│   ├── test.php                # Test PHP cơ bản
│   ├── api_test.php            # Test API endpoints
│   ├── test_db_connection.php  # Test kết nối database
│   └── debug_request.php       # Debug HTTP requests
│
├── docs/                        # Tài liệu dự án
│   ├── README.md               # Hướng dẫn tổng quan
│   ├── STRUCTURE.md            # File này - Giải thích cấu trúc
│   ├── SETUP.md                # Hướng dẫn cài đặt
│   ├── BACKEND_COMPLETE.md     # Tài liệu backend
│   └── Report.docx             # Báo cáo dự án
│
├── backend/                     # Backend API (PHP)
│   ├── api.php                 # API endpoint chính
│   ├── config/                 # Cấu hình database
│   ├── controllers/            # Controllers
│   ├── core/                   # Core classes
│   ├── models/                 # Models
│   └── routes/                 # Route definitions
│
└── index.html                   # Trang chính

```

## 🔄 Thay đổi chính

### 1. **Modules** (`/modules/`)

- Tất cả các file module JavaScript đã được chuyển vào thư mục này
- Giúp tách biệt logic nghiệp vụ khỏi cấu trúc chính
- Dễ dàng tìm kiếm và bảo trì

### 2. **Assets** (`/assets/`)

- **CSS** (`/assets/css/`): Chứa file `sitai.css` - stylesheet chính
- **JS** (`/assets/js/`): Chứa file `app.js` - entry point của ứng dụng
- Tách biệt rõ ràng giữa tài nguyên tĩnh và logic

### 3. **Tests** (`/tests/`)

- Tất cả các file test (HTML và PHP) được chuyển vào đây
- **File HTML**: test.html, test_api_call.html
- **File PHP**: test.php, api_test.php, test_db_connection.php, debug_request.php
- Tách biệt code kiểm thử khỏi code sản phẩm

### 4. **Docs** (`/docs/`)

- Tất cả tài liệu dự án được tổ chức tại đây
- **README.md**: Hướng dẫn tổng quan về dự án
- **STRUCTURE.md**: Giải thích cấu trúc thư mục (file này)
- **SETUP.md**: Hướng dẫn cài đặt chi tiết
- **BACKEND_COMPLETE.md**: Tài liệu API backend
- **Report.docx**: Báo cáo dự án

## 📝 Import Paths

### Trong `index.html`:

```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/sitai.css" />

<!-- JavaScript -->
<script type="module" src="assets/js/app.js"></script>
```

### Trong `assets/js/app.js`:

```javascript
// Import từ thư mục modules (relative path)
import * as Auth from "../../modules/authModule.js";
import * as EmployeeDb from "../../modules/employeeDbModule.js";
import * as Dashboard from "../../modules/dashboardModule.js";
// ... các import khác
```

### Trong các module files (VD: `modules/employeeManagementModule.js`):

```javascript
// Import module khác trong cùng thư mục
import * as EmployeeDb from "./employeeDbModule.js";
import * as Department from "./departmentModule.js";
import * as Position from "./positionModule.js";
```

## ✅ Lợi ích của cấu trúc mới

1. **Tổ chức rõ ràng**: Mỗi loại file có thư mục riêng
2. **Dễ bảo trì**: Tìm kiếm và cập nhật code dễ dàng hơn
3. **Scalability**: Dễ dàng mở rộng với các module mới
4. **Best practices**: Tuân theo chuẩn tổ chức project hiện đại
5. **Separation of concerns**: Tách biệt rõ ràng giữa presentation, logic, và data

## 🚀 Chạy ứng dụng

Sau khi tổ chức lại, ứng dụng vẫn hoạt động bình thường:

1. Mở `index.html` trong trình duyệt
2. Hoặc chạy local server:

   ```bash
   # Python 3
   python -m http.server 8000

   # PHP
   php -S localhost:8000
   ```

3. Truy cập: `http://localhost:8000`

## 📌 Lưu ý

- Tất cả các đường dẫn import đã được cập nhật tự động
- Không cần thay đổi code logic trong các module
- Backend (`/backend/`) giữ nguyên cấu trúc
- Git history được bảo toàn
