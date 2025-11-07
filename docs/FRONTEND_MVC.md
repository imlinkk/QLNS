# 🏗️ Kiến trúc MVC - HRM System Frontend

## 📋 Tổng quan

Dự án đã được **refactor hoàn toàn** theo kiến trúc **MVC (Model-View-Controller)** chuẩn, tách biệt rõ ràng giữa:

- **Model**: Data layer - Gọi API backend
- **View**: Presentation layer - Render HTML
- **Controller**: Business logic - Xử lý sự kiện và điều phối

---

## 🎯 Cấu trúc MVC

```
frontend/
├── app.js                  # Entry point - Khởi tạo ứng dụng
│
├── models/                 # MODEL LAYER - Data management
│   ├── BaseModel.js       # Abstract base class cho models
│   ├── EmployeeModel.js   # Employee data operations
│   ├── DepartmentModel.js # Department data operations
│   ├── PositionModel.js   # Position data operations
│   ├── SalaryModel.js     # Salary data operations
│   ├── AttendanceModel.js # Attendance data operations
│   ├── LeaveModel.js      # Leave data operations
│   ├── PerformanceModel.js# Performance data operations
│   └── AuthModel.js       # Authentication
│
├── views/                  # VIEW LAYER - Presentation
│   ├── BaseView.js        # Abstract base class cho views
│   ├── DashboardView.js   # Dashboard UI
│   ├── EmployeeView.js    # Employee management UI
│   └── LoginView.js       # Login/Register UI
│
├── controllers/            # CONTROLLER LAYER - Business Logic
│   ├── DashboardController.js   # Dashboard logic
│   ├── EmployeeController.js    # Employee management logic
│   └── AuthController.js        # Authentication logic
│
├── core/                   # CORE UTILITIES
│   ├── ApiService.js      # HTTP client for API calls
│   └── Router.js          # Frontend routing
│
└── utils/                  # HELPER FUNCTIONS
    └── (future utilities)
```

---

## 🔄 Luồng hoạt động MVC

```
User Action (Click/Submit)
    ↓
CONTROLLER receives event
    ↓
CONTROLLER calls MODEL to fetch/update data
    ↓
MODEL makes API request to BACKEND
    ↓
BACKEND processes and returns data
    ↓
MODEL returns data to CONTROLLER
    ↓
CONTROLLER passes data to VIEW
    ↓
VIEW renders HTML to user
```

---

## 📁 Chi tiết từng layer

### 1. **MODEL LAYER** (`/models/`)

#### BaseModel.js

```javascript
// Abstract base class với CRUD operations
-getAll() - // GET all records
  getById(id) - // GET single record
  create(data) - // POST new record
  update(id, data) - // PUT update record
  delete id - // DELETE record
  search(criteria); // Search with filters
```

#### EmployeeModel.js

```javascript
// Extends BaseModel
-getAllWithDetails() - // GET employees với department, position
  searchEmployees(criteria) - // Search với filters
  getStatistics() - // Thống kê nhân viên
  getByDepartment(id) - // Filter theo phòng ban
  getByPosition(id); // Filter theo vị trí
```

**Đặc điểm:**

- ✅ **API-based**: Gọi backend API thay vì localStorage
- ✅ **Singleton pattern**: Mỗi model là 1 instance duy nhất
- ✅ **Async/await**: Xử lý bất đồng bộ hiện đại
- ✅ **Error handling**: Try-catch đầy đủ

---

### 2. **VIEW LAYER** (`/views/`)

#### BaseView.js

```javascript
// Base class cho tất cả views
-render(html) - // Render HTML vào container
  clear() - // Xóa nội dung
  showLoading() - // Hiển thị loading spinner
  showError(msg) - // Hiển thị lỗi
  showSuccess(msg) - // Hiển thị thành công
  showEmpty(); // Hiển thị empty state
```

#### DashboardView.js

```javascript
-renderDashboard(stats, username) - // Render dashboard với stats
  renderDepartmentChart(data) - // Biểu đồ phòng ban
  renderNewestEmployee(emp); // Card nhân viên mới
```

#### EmployeeView.js

```javascript
-renderEmployeeManagement(depts, positions) - // Render toàn bộ UI
  renderSearchTab() - // Tab tìm kiếm
  renderAddTab() - // Tab thêm mới
  renderEditTab() - // Tab sửa
  renderDeleteTab() - // Tab xóa
  renderEmployeeList() - // Render bảng nhân viên
  renderSearchResults(); // Kết quả tìm kiếm
```

**Đặc điểm:**

- ✅ **Template methods**: Tạo HTML strings
- ✅ **No logic**: Chỉ render, không xử lý data
- ✅ **Reusable**: Có thể tái sử dụng ở nhiều nơi
- ✅ **Separation**: Tách biệt hoàn toàn khỏi business logic

---

### 3. **CONTROLLER LAYER** (`/controllers/`)

#### DashboardController.js

```javascript
-init() - // Khởi tạo dashboard
  calculateStatistics() - // Tính toán thống kê
  destroy(); // Cleanup khi rời khỏi route
```

#### EmployeeController.js

```javascript
-init() - // Khởi tạo employee management
  setupEventListeners() - // Đăng ký event handlers
  switchTab(name) - // Chuyển tab
  loadEmployeeLists() - // Load danh sách nhân viên
  performSearch() - // Tìm kiếm
  addEmployee() - // Thêm nhân viên mới
  loadEmployeeForEdit(id) - // Load data để edit
  updateEmployee() - // Cập nhật nhân viên
  deleteEmployee(id) - // Xóa nhân viên
  destroy(); // Cleanup
```

#### AuthController.js

```javascript
-init(onLoginSuccess) - // Khởi tạo auth
  setupEventListeners() - // Event handlers
  handleSubmit() - // Xử lý form submit
  login(username, password) - // Đăng nhập
  register(username, pass) - // Đăng ký
  logout() - // Đăng xuất
  isAuthenticated(); // Kiểm tra auth
```

**Đặc điểm:**

- ✅ **Event handling**: Lắng nghe và xử lý user events
- ✅ **Orchestration**: Điều phối giữa Model và View
- ✅ **Validation**: Kiểm tra dữ liệu trước khi gửi
- ✅ **Lifecycle**: init() và destroy() methods

---

### 4. **CORE LAYER** (`/core/`)

#### ApiService.js

```javascript
// HTTP client singleton
-get(endpoint, params) - // GET request
  post(endpoint, data) - // POST request
  put(endpoint, data) - // PUT request
  delete endpoint - // DELETE request
  handleResponse(response); // Parse response
```

#### Router.js

```javascript
// Frontend routing manager
-register(name, Controller) - // Đăng ký route
  navigate(name) - // Chuyển route
  updateActiveMenu(name) - // Cập nhật active menu
  getCurrentRoute(); // Lấy route hiện tại
```

**Đặc điểm:**

- ✅ **Centralized**: Tập trung xử lý API calls
- ✅ **DRY**: Không lặp code
- ✅ **Error handling**: Xử lý lỗi thống nhất
- ✅ **SPA routing**: Single Page Application

---

## 🎯 So sánh: Trước vs Sau

### ❌ **TRƯỚC** (Module-based)

```
employeeManagementModule.js:
- getAllEmployees() từ localStorage  ❌
- render HTML                         ❌
- handle events                       ❌
- update localStorage                 ❌
→ Tất cả logic trộn lẫn trong 1 file
```

### ✅ **SAU** (MVC Architecture)

```
Model (EmployeeModel.js):
- getAll() → calls API              ✅

View (EmployeeView.js):
- renderEmployeeManagement()         ✅

Controller (EmployeeController.js):
- setupEventListeners()              ✅
- addEmployee() → Model → View       ✅
→ Tách biệt rõ ràng, dễ maintain
```

---

## 📊 Ưu điểm của MVC

### 1. **Separation of Concerns**

- Model: Chỉ lo data
- View: Chỉ lo UI
- Controller: Chỉ lo logic

### 2. **Maintainability**

- Dễ tìm bugs
- Dễ thêm features
- Dễ refactor

### 3. **Testability**

- Test Model riêng
- Test View riêng
- Test Controller riêng

### 4. **Scalability**

- Thêm models mới dễ dàng
- Thêm views mới không ảnh hưởng logic
- Thêm controllers mới theo pattern

### 5. **Team Collaboration**

- Frontend dev làm Views
- Backend dev làm Models
- Full-stack làm Controllers

---

## 🚀 Cách sử dụng

### Thêm module mới

1. **Tạo Model**:

```javascript
// frontend/models/NewModel.js
import { BaseModel } from "./BaseModel.js";

export class NewModel extends BaseModel {
  constructor() {
    super("/new-endpoint");
  }

  // Custom methods...
}

export default new NewModel();
```

2. **Tạo View**:

```javascript
// frontend/views/NewView.js
import { BaseView } from "./BaseView.js";

export class NewView extends BaseView {
  renderNewInterface() {
    const html = `<div>...</div>`;
    this.render(html);
  }
}
```

3. **Tạo Controller**:

```javascript
// frontend/controllers/NewController.js
import NewModel from "../models/NewModel.js";
import { NewView } from "../views/NewView.js";

export class NewController {
  constructor(container) {
    this.view = new NewView(container);
    this.model = NewModel;
  }

  async init() {
    const data = await this.model.getAll();
    this.view.renderNewInterface(data);
  }
}
```

4. **Đăng ký Route**:

```javascript
// frontend/app.js
import { NewController } from './controllers/NewController.js';

registerRoutes() {
    this.router.register('new-module', NewController);
}
```

---

## 🔧 API Configuration

Cấu hình base URL trong `ApiService.js`:

```javascript
constructor() {
    // Development
    this.baseUrl = 'http://localhost/HRmOfLink/backend/api.php';

    // Production
    // this.baseUrl = '/backend/api.php';
}
```

---

## 📝 Best Practices

### Models

- ✅ Chỉ chứa data operations
- ✅ Async/await cho tất cả API calls
- ✅ Error handling với try-catch
- ✅ Return data, không render UI

### Views

- ✅ Chỉ render HTML
- ✅ Không chứa business logic
- ✅ Sử dụng template strings
- ✅ Helper methods cho formatting

### Controllers

- ✅ Orchestrate giữa Model và View
- ✅ Handle user events
- ✅ Validate input
- ✅ Implement lifecycle methods (init, destroy)

---

## 🎓 Kết luận

Frontend **HOÀN TOÀN MVC** như Backend! 🎉

- ✅ **Model**: API calls thay vì localStorage
- ✅ **View**: Pure HTML rendering
- ✅ **Controller**: Event handling & orchestration
- ✅ **Router**: SPA navigation
- ✅ **Scalable**: Dễ mở rộng
- ✅ **Maintainable**: Dễ bảo trì
- ✅ **Professional**: Chuẩn industry

---

**Tác giả**: GitHub Copilot  
**Ngày**: November 7, 2025  
**Version**: 2.0.0 (MVC Architecture)
